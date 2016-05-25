#!/bin/bash

cd "$BABY_LOGGER"

setup_credentials() {
	mv credentials.properties credentials.properties.orig
	cp test/credentials.properties.test credentials.properties
}


setup_db() {
	./scripts/init_db.sh
}

insert_sleep() {
	echo "todo: insert sleep"
}

insert_pee() {
	echo "todo: insert pee"
}

insert_feed() {
	echo "todo: insert feed"
}

check_results() {
	echo "todo: check_results"
}

cleanup() {
	echo "Dropping the test database"
	./scripts/drop_db.sh
	echo "Moving original credentials back in place"
	mv credentials.properties.orig credentials.properties
}

setup_credentials
setup_db
insert_sleep
insert_pee
insert_feed
check_results
cleanup
