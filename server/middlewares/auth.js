const jwt = require('jsonwebtoken')

const config = require("../config/keys")
const User = require("../models/User")

const checkIsAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId)

  if(user.role === "manager"){
    next()
  }else{
    return res.status(403).send({
        error: "Forbidden",
        message: "You don't have the rights for this action!",
    })
  }
}

const checkAuthentication = (req, res, next) => {
  let token = ""
  if(req.headers.authorization){
    token = req.headers.authorization.split(" ")[1]
  }

  if(!token){
    return res.status(401).send({
      error: "Unauthorized",
      message: "Missing authentication token!",
    })
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if(err){
      return res.status(401).send({
        error: "Unauthorized",
        message: "Failure to authenticate token!",
      })
    }
    
    req.userId = decoded.id
    next()
  })
}

module.exports = {
  checkAuthentication,
  checkIsAdmin,
}