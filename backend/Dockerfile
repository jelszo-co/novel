###########
# BUILDER #
###########

FROM python:3.7.6-alpine as builder

# set work directory
WORKDIR /usr/src/novel

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apk update && apk add libressl-dev postgresql-dev libffi-dev gcc musl-dev python3-dev 
RUN pip install --upgrade pip

# install dependencies
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/novel/wheels -r requirements.txt


#########
# FINAL #
#########

FROM python:3.7.6-alpine

# create directory for the app user
RUN mkdir -p /home/novel

# create the app user
RUN addgroup -S novel && adduser -S novel -G novel

# create the appropriate directories
ENV HOME=/home/novel
ENV NOVEL_HOME=/home/novel/web
RUN mkdir $NOVEL_HOME
WORKDIR $NOVEL_HOME

# install dependencies
RUN apk update && apk add libpq
COPY --from=builder /usr/src/novel/wheels /wheels
COPY --from=builder /usr/src/novel/requirements.txt .
RUN pip install --no-cache --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entrypoint-prod.sh
COPY ./entrypoint.sh $NOVEL_HOME

# copy project
COPY . $NOVEL_HOME

# chown all the files to the user novel
RUN chown -R novel:novel $NOVEL_HOME

# change to user novel
USER novel

# run entrypoint.sh
ENTRYPOINT ["/home/novel/web/entrypoint.sh"]
