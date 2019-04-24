#! /bin/bash

if [ ! -f .env ]; then
  echo ".env does not exist"
  exit 1
fi

docker-compose -f docker-compose.yml up -d --build

argument="$1"
case $argument in
  --create)
    echo "*** Creating comparison pairs randomly ***"
    docker exec -w /data/utils server node createComparisonData.js
    ;;
esac

docker exec -w /data/utils mongo ./createVotesDB.sh

docker-compose down

echo
echo "****************************"
echo "Setup Completed Successfully"
