#!/bin/bash
cd "$BABY_LOGGER"
mysql home_data < ./database/drop_tables.sql
mysql home_data < ./database/create_tables.sql
