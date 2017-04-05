#!/bin/bash

set -e

cd "$BABY_LOGGER"
DB=$(cat credentials.properties |grep db|cut -c4-)
mysql "$DB" < ./database/drop_tables.sql
mysql "$DB" < ./database/r0_to_r1.sql
mysql "$DB" < ./database/r1_to_r2.sql
