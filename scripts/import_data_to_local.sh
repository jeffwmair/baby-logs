#!/bin/bash

set -e

cd "$BABY_LOGGER"
DB=$(cat credentials.properties |grep db|cut -c4-)
mysql "$DB" < database/export.sql
