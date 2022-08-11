const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {checkAuthentication} = require('../middlewares/auth')
const Rating = require('../models/Rating')
const User = require('../models/User')
const Bike = require('../models/Bike')


router.get('', [checkAuthentication], async (req, res) => {
  const data = await Rating.find(req.query)
  return res.json(data)
})

router.post("/", [checkAuthentication], (req, res) => {
  if(req.body.rating < 1 || req.body.rating > 5)
    return res.status(400).json("Please specify a valid rating input!")
  User.findOne({_id: req.body.userId}).then((user) => {
    if(!user){
      return res.status(401).json("Unauthorized access attempt!")
    }
    Bike.findOne({_id: req.body.bikeId}).then((bike) => {
      if(!bike){
        return res.status(400).json("Bike you rated no longer exists!")
      }
      Rating.findOne({ratedBy: req.body.userId, bike: req.body.bikeId, reservation: req.body.reservation}).then((rating) => {
        if(rating){
          return res.status(400).json("You already rated this reservation!")
        }
        const newRating = new Rating({
          ratedBy: user._id,
          bike: bike._id,
          rating: req.body.rating,
          reservation: req.body.reservation
        })
        newRating
          .save()
          .then((rating) => {
            Rating.aggregate([
              { $match: {bike: mongoose.Types.ObjectId(bike._id)} },
              { $group: {
                _id: null,
                ratingAvg: { $avg: "$rating" }
              }}
            ]).then((data) => {
              bike.rating = parseFloat(data[0].ratingAvg.toFixed(2))
              bike.save()
              res.status(200).json("Successfully rated the reservation for this bike!")
            }).catch((err) => {
              return res.status(400).json("Bike you rated no longer exists2!")
            })
          }).catch((err) => {
            return res.status(400).json("Bike you rated no longer exists3!")
          })
      })
    })
  })
})

module.exports = router