#!/usr/bin/env bash
# This wrapper is mostly useful for Docker

pipenv run python ./backend/local_scraper.py "$@"
