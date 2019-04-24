#! /bin/bash

mongo <<EOF
use votes
EOF

mongoimport --db votes --collection comparisons --authenticationDatabase admin \
  -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD \
  --file comparisons_data.json

mongo --authenticationDatabase admin -u $MONGO_INITDB_ROOT_USERNAME \
  -p $MONGO_INITDB_ROOT_PASSWORD <<EOF
use votes
db.comparisons.createIndex({"t": 1})
db.comparisons.createIndex({"u": 1})
EOF
