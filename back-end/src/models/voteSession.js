const mongoose = require('mongoose')

/*
  Schema description:
    - d : date and time which the vote session started
    - vot : array which contains the comparisons displayed
      and the choice of the user
        -- imL : the left image id
        -- imR : the right image id
        -- imC : the id of the chosen image
    - acc : is true when the vote session was accepted
      by the answer quality control
*/
const voteSessionSchema = new mongoose.Schema({
  d: {
    type: Date,
    required: true
  },
  vot: [new mongoose.Schema({
    imL: {
      type: Number,
      required: true
    },
    imR: {
      type: Number,
      required: true
    },
    imC: {
      type: Number,
      required: true
    }
  }, { _id: false })],
  acc: {
    type: Boolean,
    default: false
  }
}, { collection: 'votesessions' })


module.exports = mongoose.model('VoteSession', voteSessionSchema)
