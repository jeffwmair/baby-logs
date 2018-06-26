#!/bin/bash
python start_server.py &> start.log &
echo "$!" > start.pid