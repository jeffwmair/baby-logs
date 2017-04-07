#!/bin/bash

export BABY_LOGGER=`pwd`

# load python dependencies
sudo pip install --egg -r requirements.txt

# Configure your credentials.properties.
# Copy the sample to credentials.properties, then edit the file and set
# your desired mysql user, password, dbname (and host if its not localhost)
cp credentials.properties.sample credentials.properties

# Setup our mysql database; from credentials.properties, the provided dbname will be created; user will be created and assigned to the db
./scripts/init_db.sh

# run unit tests (if you like)
./scripts/runtests.sh     

# run the web server (disconnect so we can exit from the ssh session)
python run.py &