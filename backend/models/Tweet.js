import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tweetSchema.statics.findAllPopulated = function () {
  return this.find({}).sort({ createdAt: -1 }).populate('user', '_id username role');
};

tweetSchema.statics.findByIdPopulated = function (id) {
  return this.findById(id).populate('user', '_id username role');
};

const Tweet = mongoose.model('Tweet', tweetSchema);

export default Tweet;