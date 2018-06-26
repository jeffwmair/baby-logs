#!/bin/bash

#exit on error
set -e

echo "Starting init db script..."

USER=''
PASS=''
DB=''
HOST=''
CREDENTIALS_FILE="credentials.properties"

cd "$BABY_LOGGER"

read_credentials() {
    if [ ! -e "$CREDENTIALS_FILE" ]; then
        echo "Credentials file $CREDENTIALS_FILE not found!"
        exit 1
    fi
    USER=$(cat "$CREDENTIALS_FILE" |grep user|cut -c6-)
    PASS=$(cat "$CREDENTIALS_FILE" |grep pass|cut -c6-)
    DB=$(cat "$CREDENTIALS_FILE" |grep db|cut -c4-)
    HOST=$(cat "$CREDENTIALS_FILE" |grep host|cut -c6-)
}

create_db() {
    echo "Creating db $DB"
    mysql --execute="create database $DB;"
}

create_user() {
    echo "Creating user $USER"
    mysql --execute="create user '$USER'@'%' identified by '$PASS';"
}

grant_user_to_db() {
    echo "granting $USER to $DB"
    mysql --execute="grant all on $DB.* to '$USER'@'%';"
}

create_tables() {
    echo "Creating tables in $DB"
    mysql "$DB" < ./database/r0_to_r1.sql
    mysql "$DB" < ./database/r1_to_r2.sql
    mysql "$DB" < ./database/r2_to_r3.sql
}

read_credentials
create_db
create_user
grant_user_to_db
create_tables	
