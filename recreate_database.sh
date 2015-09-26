#!/bin/bash
mysql --user=internetUsage --password=internetUsage home_data < database/drop_tables.sql
mysql --user=internetUsage --password=internetUsage home_data < database/create_tables.sql
mysql --user=internetUsage --password=internetUsage home_data < database/insert_sample_data.sql
