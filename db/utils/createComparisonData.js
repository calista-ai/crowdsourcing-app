const path = require('path');
const fs = require('fs');

fs.writeFileSync('comparisons_data.json', '')

const imagesNumber = parseInt(process.env.NUMBER_OF_IMAGES) || parseInt(process.argv[2])

console.log('Creating data for ' + imagesNumber + ' images ...')

images1 = []
images2 = []

for (let i=1; i < imagesNumber; i++) {
  for (let j = 0; j < i; j ++) {
    images1.push(i)
    images2.push(j)
  }
}


randomSelectedImages1 = []
randomSelectedImages2 = []

while (images1.length > 0) {

  let randomSelection = Math.floor(Math.random() * images1.length)

  randomSelectedImages1.push(images1.splice(randomSelection, 1)[0])
  randomSelectedImages2.push(images2.splice(randomSelection, 1)[0])

}

for (let _id = 0; _id < randomSelectedImages1.length; _id++) {
  let selectionData = {
    "_id": _id,
    "im1": randomSelectedImages1[_id],
    "im2": randomSelectedImages2[_id],
    "w1": 0,
    "w2": 0,
    "t": 0,
    "u": false
  }

  fs.appendFileSync('comparisons_data.json', JSON.stringify(selectionData) + '\n')
}

console.log('**** DONE ****')
