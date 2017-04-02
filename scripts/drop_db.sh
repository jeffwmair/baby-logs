#!/bin/bash

USER=''
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
    DB=$(cat "$CREDENTIALS_FILE" |grep db|cut -c4-)
    HOST=$(cat "$CREDENTIALS_FILE" |grep host|cut -c6-)
}

drop_db() {
    echo "Dropping db $DB"
    mysql --execute="drop database $DB;"
}

drop_user() {
    echo "Dropping user $USER"
    mysql --execute="drop user '$USER'@'$HOST';"
}

read_credentials
drop_db
drop_user

