#!/bin/bash

#exit on error
set -e

echo "Starting init db script..."

USER=$1
PASS=$2
DB=$3
HOST=$4

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


cd "$BABY_LOGGER"

create_db() {
	echo "Creating db $DB"
	mysql --execute="create database $DB;"
}

create_user() {
	echo "Creating user $USER"
	mysql --execute="create user '$USER'@'$HOST' identified by '$PASS';"
}

grant_user_to_db() {
	echo "Granting user $USER to $DB"
	mysql --execute="grant all on $DB.* to '$USER'@'$HOST';"
}

create_tables() {
	echo "Creating tables in $DB"
	mysql "$DB" < ./database/create_tables.sql
	mysql "$DB" < ./database/insert_seed_data.sql
}

create_db
create_user
grant_user_to_db
create_tables	
./scripts/create_credentials_properties.sh "$USER" "$PASS" "$DB" "$HOST"
