#! /bin/bash

dt=$(date '+%d_%m_%Y__%H_%M_%S');
mongodump --db votes --authenticationDatabase admin \
  -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD \
  -o ../backup/$dt
