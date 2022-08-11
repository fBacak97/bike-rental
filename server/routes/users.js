const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();
const jwt = require('jsonwebtoken')

const {checkIsAdmin, checkAuthentication} = require('../middlewares/auth')
const User = require('../models/User')
const jwtSecret = require("../config/keys").jwtSecret;

//TODO: Find Criteria if needed
router.get('', [checkAuthentication, checkIsAdmin], (req, res) => {
  User.find().populate({path: 'reservations', populate: {path: 'bike'}}).limit(10).skip((req.query.pageNum-1) * 10)
    .then((data) => {
      User.estimatedDocumentCount({}).then((count) => {
        return res.json({count: count, users: data})
      })
    }).catch((err) => {
      return res.status(400).json(err);
    })
})

router.patch('/:id', [checkAuthentication, checkIsAdmin], (req, res) => {
  User.findOne({_id: req.params.id}).then((user) => {
    if(!user){
      return res.status(400).json({ email: "That user no longer exists!" });
    }
    user.email = req.body.email
    user.role = req.body.role
    // Hash password before saving in database
    if(user.password != req.body.password){
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save().then((user) => {
            return res.json(user)
          }).catch((err) => {
            return res.status(400).json("That e-mail is already taken!")
          })
        })
      })
    }
   else{
    user.save().then((user) => {
      return res.json(user)
    }).catch((err) => {
      return res.status(400).json("That e-mail is already taken!")
    })
   }
  })
})

router.delete("/:id", [checkAuthentication, checkIsAdmin], (req, res) => {
  User.findOneAndDelete({_id: req.params.id}).then((user) => {
    if(!user){
      return res.status(400).json("This user no longer exists!")
    }
    return res.status(200).json("Successfully deleted user!")
  })
})

router.post("/", [checkAuthentication, checkIsAdmin], (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if(user){
      return res.status(400).json({ email: "Email already exists!" });
    }else{
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              (res.json(user))
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if(user){
      return res.status(400).json({ email: "Email already exists!" });
    }else{
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        role: "user",
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              (res.json(user))
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});


router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if(!user){
      return res.status(404).json({ email: "Email not found!" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if(isMatch){
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role,
        };
        // Sign token
        jwt.sign(
          payload,
          jwtSecret,
          {
            expiresIn: 2630000, // 1month
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      }else{
        return res.status(400).json({ password: "Password incorrect!" });
      }
    });
  });
});

module.exports = router