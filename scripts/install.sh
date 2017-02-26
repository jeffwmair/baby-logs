#!/bin/bash

# Create your python virtual env using:
virtualenv venv

# Activate the environment
source activate_environment.sh

# After activating the environment, run the load_requirements_into_venv script.
./scripts/load_requirements_into_venv.sh

# Configure your credentials.properties.
# Copy the sample to credentials.properties, then edit the file and set
# your desired mysql user, password, dbname (and host if its not localhost)
cp credentials.properties.sample credentials.properties

# Setup our mysql database; from credentials.properties, the provided dbname will be created; user will be created and assigned to the db
./scripts/init_db.sh

# run unit tests (if you like)
./scripts/runtests.sh     

# run the web server (disconnect so we can exit from the ssh session)
./scripts/start.sh > logs.txt &