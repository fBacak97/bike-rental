const express = require('express')
const router = express.Router()
const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)

const {checkIsAdmin ,checkAuthentication} = require('../middlewares/auth')
const Bike = require("../models/Bike")

router.get('', [checkAuthentication], async (req, res) => {
  
  const queryBuilder = {}
  req.query.location && (queryBuilder.location = {$regex: req.query.location, $options: 'i'})
  req.query.color && (queryBuilder.color = {$regex: req.query.color, $options: 'i'})
  req.query.model && (queryBuilder.model = {$regex: req.query.model, $options: 'i'})
  req.query.rating && (queryBuilder.rating = {$gte: req.query.rating})
  req.query.availability && (queryBuilder.availability = req.query.availability)

  //Check for admin privilege to fetch unavailable bikes as well!
  if(!req.query.availability){
    const {role} = await User.findById(req.userId)

    if(role != "manager"){
      return res.status(403).send({
        error: "Forbidden",
        message: "You don't have the rights for this action!",
      })
    }
  }

  Bike.find(queryBuilder)
    .populate({path: 'reservations', populate: {path: 'reservedBy'}})
    .then((bikes) => {
      if(req.query.interval){
        const interval = JSON.parse(req.query.interval)
        const filteredData = bikes.filter((elem) => {
          return !(elem.reservations.find((reservation) => {
            const requestedinterval = moment.range(interval.start, interval.end)
            const reservationInterval = moment.range(reservation.startDate, reservation.endDate)
            return requestedinterval.overlaps(reservationInterval)
          }))
        })
        const filteredCount = filteredData.length
        const paginatedResult = filteredData.slice((req.query.pageNum-1) * req.query.limit, (req.query.pageNum-1) * req.query.limit + req.query.limit)
        return res.json({count: filteredCount, bikes: paginatedResult})
      }
      return res.json({count: bikes.length, bikes: bikes.slice((req.query.pageNum-1) * req.query.limit, (req.query.pageNum-1) * req.query.limit + req.query.limit)})
    }).catch((err) => {
      console.log(err)
    })
})

router.patch('/:id', [checkAuthentication, checkIsAdmin], (req, res) => {
  Bike.findOne({_id: req.params.id}).then((bike) => {
    if(!bike){
      return res.status(400).json("That bike no longer exists!")
    }
    bike.color = req.body.color
    bike.model = req.body.model
    bike.location = req.body.location
    bike.availability = req.body.availability
    bike.save().then((bike) => {
      return res.json(bike)
    }).catch((err) => {
      return res.json("Something went wrong!")
    })
  })
})

router.delete("/:id", [checkAuthentication, checkIsAdmin], (req, res) => {
  Bike.findOneAndDelete({_id: req.params.id}).then((bike) => {
    if(!bike){
      return res.status(400).json("This bike no longer exists!")
    }
    return res.status(200).json("Successfully deleted the bike!")
  })
})

router.post("/", [checkAuthentication, checkIsAdmin], (req, res) => {
  const newBike = new Bike({
    model: req.body.model,
    color: req.body.color,
    location: req.body.location,
  })
  newBike
    .save()
    .then((bike) => {
      res.json(bike)
    }).catch((err) => {
      console.log(err)
    })
})

module.exports = router