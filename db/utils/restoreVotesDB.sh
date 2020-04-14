#! /bin/bash

mongorestore --drop --authenticationDatabase admin \
  -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD \
  --db votes $1
