const mongoose = require('mongoose')

/*
  Schema description:
    - im1 : first image id
    - im2 : second image id
    - w1 : number of times the first image won
    - w2 : number of times the second image won
    - t : number of times the comparison was displayed (w1 + w2)
    - u : is true if the comparison is displayed in a vote
      session at the moment
*/
const ComparisonSchema = new mongoose.Schema({
  _id: Number,
  im1: Number,
  im2: Number,
  w1: Number,
  w2: Number,
  t: Number,
  u: {
    type: Boolean,
    default: false
  }
}, { collection: 'comparisons' })


module.exports = mongoose.model('Comparison', ComparisonSchema)
