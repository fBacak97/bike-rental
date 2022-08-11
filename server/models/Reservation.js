const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  reservedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  bike: {
    type: Schema.Types.ObjectId,
    ref: 'Bike',
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
});

module.exports = Reservation = mongoose.model("Reservation", ReservationSchema);