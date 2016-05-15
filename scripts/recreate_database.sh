#!/bin/bash

set -e

cd "$BABY_LOGGER"
DB=$(cat credentials.properties |grep db|cut -c4-)
mysql "$DB" < ./database/drop_tables.sql
mysql "$DB" < ./database/create_tables.sql
