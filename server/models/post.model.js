import mongoose from 'mongoose'
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required'
  },
  description: {
    type: String,
    required: 'Description is required'
  },
  eventTime: {
      start: {type: Date, required: 'Start datetime is required'},
      end: {type: Date, required: 'End datetime is required'}
  },
  address: {
    type: String,
    required: 'General location is required'
  },
  ensemble: [{
    instrument: {type: String},
    musician: {type: mongoose.Schema.ObjectId, required: false, ref: 'User'}}],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
  }],
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Post', PostSchema)
