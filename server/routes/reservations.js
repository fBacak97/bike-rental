const express = require('express')
const router = express.Router()
const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)

const {checkAuthentication} = require('../middlewares/auth')
const Reservation = require('../models/Reservation')
const User = require('../models/User')
const Bike = require('../models/Bike')

router.get('', [checkAuthentication], async (req, res) => {
  if(req.query.reservedBy === req.userId){
    const data = await Reservation.find(req.query).populate('bike')
    return res.json(data)
  }
  return res.status(401).json('Unauthorized')
})

router.post("/", [checkAuthentication], (req, res) => {
  if(moment(req.body.dateRange.start).isBefore(moment()) || moment(req.body.dateRange.end).isBefore(moment())){
    return res.status(400).json("You cannot make a reservation in the past!")
  }
  User.findOne({_id: req.body.userId}).then((user) => {
    Bike.findOne({_id: req.body.bikeId, availability: true}).populate('reservations').then((bike) => {
      if(!bike){
        return res.status(400).json("Requested bike is not available!")
      }
      const dateRange = [req.body.dateRange.start, req.body.dateRange.end]
      if(bike.reservations.find((elem) => 
        moment.range(elem.startDate, elem.endDate).overlaps(moment.range(dateRange))
      )){
        return res.status(400).json("Requested reservation dates overlaps with another reservation!")
      }
      const newReservation = new Reservation({
        reservedBy: user._id,
        bike: bike._id,
        startDate: dateRange[0],
        endDate: dateRange[1],
      })
      newReservation
        .save()
        .then((reservation) => {
          bike.reservations.push(newReservation)
          bike.save()
          user.reservations.push(newReservation)
          user.save()
          res.status(200).json("Successfully reserved the bike!")
        }).catch((err) => {
          console.log(err)
        })
    })
  })
})

router.delete("/:id", [checkAuthentication], (req, res) => {
  Reservation.findOneAndDelete({_id: req.params.id, reservedBy: req.userId}).then((reservation) => {
    if(!reservation){
      return res.status(400).json("This reservation no longer exists or the reservation is not made by you!")
    }
    return res.status(200).json("Successfully canceled reservation")
  })
})

module.exports = router