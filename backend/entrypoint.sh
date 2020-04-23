#!/bin/sh
python3 manage.py migrate
envsubst < /etc/nginx/conf.d/novel.conf.temp > /etc/nginx/conf.d/novel.conf
nginx
gunicorn -b 0.0.0.0:60000 backend.wsgi 
exec "$@"
