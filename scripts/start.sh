#!/bin/bash
cd "$BABY_LOGGER"
. venv/bin/activate
python cherrypy_start.py
