#!/bin/bash
if [ ! -f start.pid ]; then
    echo "Start.pid file found, so cannot try to stop the server.  Maybe it is not running anyway?"
    exit 1
fi

echo "Killing pid:"
cat start.pid
cat start.pid | xargs kill
rm start.pid