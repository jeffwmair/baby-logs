#!/bin/bash
cd "$BABY_LOGGER"
python -m unittest test.domain.day_test test.domain.sleep_test test.domain.feed_test test.domain.diaper_test test.db_records_test
