#!/bin/bash

USER=$1
PASS=$2
DB=$3
HOST=$4
CREDS_FILE="credentials.properties"

if [ -z "$USER" ]; then
	echo "User argument not provided"
	exit 1
fi
if [ -z "$PASS" ]; then
	echo "User argument not provided"
	exit 1
fi
if [ -z "$DB" ]; then
	echo "User argument not provided"
	exit 1
fi
if [ -z "$HOST" ]; then
	echo "User argument not provided"
	exit 1
fi


echo "Writing credentials file"
echo "user=$USER" > "$CREDS_FILE"
echo "pass=$PASS" >> "$CREDS_FILE"
echo "host=$HOST" >> "$CREDS_FILE"
echo "db=$DB" >> "$CREDS_FILE"
echo "disable.modifications=False" >> "$CREDS_FILE"

