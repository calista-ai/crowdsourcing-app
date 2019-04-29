const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const voteRoutes = express.Router()
const VoteSession = require('./models/voteSession.js')
const Comparison = require('./models/comparison.js')

const PORT = process.env.PORT || 4000
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/votes"

// number of comparisons that will be displayed in a vote session
const numberOfComparisons = parseInt(process.env.VOTING_ROUNDS) || 8

// time limit for each voting round (in seconds)
const timeLimitOfEachComparison = parseInt(process.env.VOTING_TIME) || 8

// number of comparisons that are used for answer quality control
const answerQualityControls = 2

app.use(cors())
app.use(bodyParser.json())

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false)

// establish connection to the database
mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(() => {
    console.error('Database connection error')
  })

// generate a random integer number between [low, high)
function randomInteger(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

// start new vote session
voteRoutes.route('/start_session').post((req, res) => {

  // create a new document and save the time/date that
  // the vote session started
  let voteSession = new VoteSession(req.body)
  voteSession.save()
    // select the comparisons that will be displayed in the vote session
    .then(voteSession => {

      const numberOfComparisonsToSelect =
        numberOfComparisons - answerQualityControls

      // get the comparisons that have been displayed less
      Comparison.find(
        { "u": false },
        {"_id": 1, "im1": 1, "im2": 1},
        { sort: {t: 1}, limit: numberOfComparisonsToSelect},
        (err, docs) => {
          if (err) {
            res.status(400).send(err)
            console.log('Failed to select images: ' + voteSession.id)
            console.log(err)
          }
          else {
            // imageLeftIds and imageRightIds contain the image pairs that will
            // be compared. imageLeftIds contains the images that will be
            // displayed on the left and imageRightIds the images that will be
            // displayed on the right.
            let imageLeftIds = []
            let imageRightIds = []

            // determine randomly the position (left or right) that images will
            // be displayed
            let imageOrder = (Math.random() > 0.5) ? true : false

            for (let i = 0; i < docs.length; i++) {

              if (imageOrder) {
                imageLeftIds.push(docs[i].im1)
                imageRightIds.push(docs[i].im2)
              }
              else {
                imageLeftIds.push(docs[i].im2)
                imageRightIds.push(docs[i].im1)
              }
            }

            // add the answer quality control comparisons. These comparisons
            // are selected randomly from imageLeftIds and imageRightIds arrays
            let answerControlIndex1 = numberOfComparisons / answerQualityControls - 1
            let answerControlIndex2 = numberOfComparisons - 1

            let controlComparisonIndex1 = randomInteger(0, answerControlIndex1 - 1)
            let controlComparisonIndex2 = randomInteger(answerControlIndex1 + 1, answerControlIndex2 - 1)

            imageLeftIds.splice(answerControlIndex1, 0, imageRightIds[controlComparisonIndex1])
            imageRightIds.splice(answerControlIndex1, 0, imageLeftIds[controlComparisonIndex1])

            imageLeftIds.splice(answerControlIndex2, 0, imageRightIds[controlComparisonIndex2])
            imageRightIds.splice(answerControlIndex2, 0, imageLeftIds[controlComparisonIndex2])

            res.status(200).send({
              '_id': voteSession.id,
              'imageLeftIds': imageLeftIds,
              'imageRightIds': imageRightIds
            })

            console.log('\nNew vote session started: ' + voteSession.id)
          }
        }
      )

      // mark the comparisons that are currently used by the vote session as "used",
      // so they are not selected by another vote session. After a time interval,
      // the comparisons will be marked again as "not used".
      .then(docs => {

        docs.forEach((doc) => {
          Comparison.updateOne({"_id" : doc._id}, {$set : {"u" : true}}, (err) => {
            if (err) {
              console.log('Error occurred while updating the comparisons selected: ' + err)
            }

            // timeout time in milliseconds
            const timeoutTime = (numberOfComparisons+1) * timeLimitOfEachComparison * 1000 + 2000

            setTimeout(() => {
              docs.forEach((doc) => {
                Comparison.updateOne({"_id" : doc._id}, {$set : {"u" : false}}, (err) => {
                  if (err) {
                    console.log('Error occurred while updating the comparisons selected: ' + err)
                  }
                })
              })
            }, timeoutTime)
          })
        })
      })

    })
    .catch(err => {
      res.status(400).send('Failed to add new voteSession')
      console.log('Failed to start new vote session')
      console.log(err)
    })

})

// add vote to vote session
voteRoutes.route('/add/:id').post((req, res) => {
  let _id = req.params.id

  // find the current vote session and add the result of a comparison
  VoteSession.findOneAndUpdate({ "_id" : _id }, { $push: {vot: req.body}}, (err, doc) => {
    if (err) {
      res.status(400).send(err)
      console.log('Failed to add vote to vote session: ' + _id)
      console.log('Error message: ' + err)
    }
    else{
      res.status(200).send('Vote added successfully: ' + _id)
      console.log('Vote added successfully: ' + _id)
    }
  })
})

// check if the vote session passes the answer quality control
function checkIfVoteSessionIsAccepted(votes) {

  // get the answer quality control comparisons
  let answerControlIndex1 = numberOfComparisons / answerQualityControls - 1
  let answerControlIndex2 = numberOfComparisons - 1

  let votesSegment1 = votes.slice(0, answerControlIndex1)
  let votesSegment2 = votes.slice(answerControlIndex1 + 1, answerControlIndex2)

  let controlVote1 = votes[answerControlIndex1]
  let controlVote2 = votes[answerControlIndex2]

  // check if the user gave correct answer to the control comparisons
  let answerIsAccepted1 = false
  for (let index = 0; index < votesSegment1.length; index++) {
    if (votesSegment1[index].imL === controlVote1.imR
      && votesSegment1[index].imR === controlVote1.imL)
    {
      answerIsAccepted1 = (votesSegment1[index].imC === controlVote1.imC)
      break
    }
  }

  let answerIsAccepted2 = false
  for (let index = 0; index < votesSegment2.length; index++) {
    if (votesSegment2[index].imL === controlVote2.imR
      && votesSegment2[index].imR === controlVote2.imL)
    {
      answerIsAccepted2 = (votesSegment2[index].imC === controlVote2.imC)
      break
    }
  }

  // the vote session is accepted only if all the control comparisons
  // were answered correctly
  return (answerIsAccepted1 && answerIsAccepted2)
}

// remove the answer quality control comparisons from the votes array
function removeControlComparisons(votes) {
  let answerControlIndex1 = numberOfComparisons / answerQualityControls - 1
  let answerControlIndex2 = numberOfComparisons - 1

  votes.splice(answerControlIndex1, 1)
  votes.splice(answerControlIndex2-1, 1)

  return votes
}

// process the votes of the user when the vote session is complete
voteRoutes.route('/submit/:id').post((req, res) => {
  let _id = req.params.id

  // get the votes of the vote session
  VoteSession.findOne({ "_id" : _id }, (err, doc) => {
    if (err) {
      res.status(400).send(err)
      console.log('Failed to find vote session for submission: ' + _id)
    }
    else {
      let votes = doc.vot

      // check if the vote session passes the answer quality control
      if (checkIfVoteSessionIsAccepted(votes))
      {
        // mark the vote session as "accepted"
        VoteSession.findOneAndUpdate({ "_id" : _id }, { $set: {acc: true}}, (err, doc) => {
          if (err) {
            res.status(400).send(err)
            console.log('Failed to accept vote session: ' + _id)
            console.log('Error message: ' + err)
          }
          else{
            console.log('Accepted vote session successfully: ' + _id)
          }
        })

        // remove the answer quality control comparisons
        votes = removeControlComparisons(votes)

        // update the comparisons collection with the results of the vote session
        for (let index = 0; index < votes.length; index++) {
          let vote = votes[index]

          // if the user did not choose an image during a voting round,
          // a timeout occurred. In this case, the comparisons collection is
          // not updated for this particular comparison
          if (vote.imC !== -1) {
            let rowId, columnId
            if (vote.imL > vote.imR) {
              rowId = vote.imL
              columnId = vote.imR
            }
            else {
              rowId = vote.imR
              columnId = vote.imL
            }

            let imageWonPropertyName = (rowId === vote.imC) ? "w1" : "w2"

            Comparison.findOneAndUpdate(
              { "im1" : rowId, "im2" : columnId },
              {
                $inc : {
                  [imageWonPropertyName] : 1,
                  "t" : 1
                }
              },
              (err, doc) => {
                if (err) {
                  console.log(`Error while updating comparison table (index ${index}): ` + _id)
                  res.status(400).send(err)
                }
                else {
                  console.log(`Comparison table updated successfully (index ${index}): ` + _id)
                }
              }
            )
          }
        }
        res.status(200).send('Vote session was processed successfully: ' + _id)
      }
      else {
        res.status(200).send('Vote session was not accepted: ' + _id)
        console.log('Vote session was not accepted: ' + _id)
      }
    }
  })

})


app.use('/votes', voteRoutes)

app.listen(PORT, () => {
  console.log('Server is running on port: ' + PORT)
})
