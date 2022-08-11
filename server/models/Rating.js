const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  ratedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  bike: {
    type: Schema.Types.ObjectId,
    ref: 'Bike',
  },
  reservation: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
});

module.exports = Rating = mongoose.model("Rating", RatingSchema);