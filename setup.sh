#! /bin/bash

if [ ! -f .env ]; then
  echo ".env does not exist"
  exit 1
fi

docker-compose -f docker-compose.yml up -d --build

for i in "$@"
do
argument="$i"
case $argument in
  --create)
    echo "*** Creating comparison pairs with a random order ***"
    docker exec -w /data/utils server node createComparisonData.js
    ;;
  --sortimages)
    echo "*** Sorting images ***"
    cd front-end/public/images
    ls
    num=0
    for file in *.png; do
       mv "$file" "$(printf "%u" $num).png"
       num=$((num + 1))
    done
    cd ../../..
    ;;
esac
done

docker exec -w /data/utils mongo ./createVotesDB.sh

docker-compose down

echo
echo "****************************"
echo "Setup Completed Successfully"
