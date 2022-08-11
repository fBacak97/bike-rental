const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'manager']
  },
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
});

module.exports = User = mongoose.model("User", UserSchema);