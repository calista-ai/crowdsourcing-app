#! /bin/bash

dataToRestore="../backup/17_04_2019__13_52_11/votes/";
mongorestore --drop --authenticationDatabase admin \
  -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD \
  --db votes $dataToRestore
