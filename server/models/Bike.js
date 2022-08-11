const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BikeSchema = new Schema({
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  }, 
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  availability: {
    type: Boolean,
    default: 'true'
  },
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
});

module.exports = Bike = mongoose.model("Bike", BikeSchema);