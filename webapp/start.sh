#!/usr/bin/env bash

gunicorn --bind=0.0.0.0:5000 --keep-alive=2000 \
    --timeout=2000 --log-level=debug  --reload \
    flaskcovid19app:app
    #flaskmoviesapp:app

# apps presented as examples throughout the course
# as expected, they run one at a time