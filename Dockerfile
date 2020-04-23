###########
# BUILDER #
###########

FROM python:3.7.6-buster as builder

# set work directory
WORKDIR /usr/src/novel

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apt update && apt install -y libffi-dev # gcc musl-dev python3-dev g++ libxml2-dev libxslt-dev
RUN pip install --upgrade pip

# install dependencies
COPY backend/requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/novel/wheels -r requirements.txt


#########
# FINAL #
#########

FROM python:3.7.6-buster

# create directory for the app user
RUN mkdir -p /home/novel

# create the app user
RUN useradd novel

# create the appropriate directories
ENV HOME=/home/novel
ENV NOVEL_HOME=/home/novel/web
RUN mkdir $NOVEL_HOME
WORKDIR $NOVEL_HOME

# install dependencies
#RUN apt update && apt install libpq
COPY --from=builder /usr/src/novel/wheels /wheels
COPY --from=builder /usr/src/novel/requirements.txt .
RUN pip install --no-cache --upgrade pip
RUN pip install --no-cache /wheels/*

RUN echo "deb https://nginx.org/packages/debian/ buster nginx" >> /etc/apt/sources.list
RUN echo "deb-src https://nginx.org/packages/debian/ buster nginx" >> /etc/apt/sources.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62
RUN apt update && apt upgrade -y
RUN apt install nginx gettext-base -y

# copy project
COPY backend/ $NOVEL_HOME

# chown all the files to the user novel
RUN chown -R novel:novel $NOVEL_HOME

COPY frontend/build/ /www

COPY novel.conf.temp /etc/nginx/conf.d/

RUN rm /etc/nginx/conf.d/default.conf

RUN chown -R novel:www-data /www
RUN chown -R novel:www-data /var/cache/nginx
RUN chown -R novel:www-data /var/log/nginx
RUN chown -R novel:www-data /etc/nginx/conf.d

# USER novel

# run entrypoint.sh
ENTRYPOINT ["/home/novel/web/entrypoint.sh"]
