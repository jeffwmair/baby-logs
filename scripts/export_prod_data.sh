#!/bin/bash

set -e

SERVER="$1"
if [ -z "$SERVER" ]; then
	echo "Please provide server: user@server"
	exit 1
fi
cd "$BABY_LOGGER"
ssh "$SERVER" 'mysqldump babylogger ' > database/export.sql
