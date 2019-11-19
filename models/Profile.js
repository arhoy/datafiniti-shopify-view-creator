const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    type: String,
  },
  karmaPoints: {
    type: Number,
  },
  phoneNumber: {
    type: Number,
  },
  about: {
    type: String,
  },
  interests: {
    type: [String],
    required: true,
  },
});
module.exports = Profile = mongoose.model('Profile', ProfileSchema);
