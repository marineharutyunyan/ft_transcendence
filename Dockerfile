FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY ./pong ./pong

WORKDIR /pong
EXPOSE 8000

RUN apk add --update --no-cache libffi-dev \
    build-base \
    postgresql-dev \
	postgresql-client

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r requirements.txt

ENV PATH="/scripts:/py/bin:$PATH"

VOLUME /pong
