const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const path = require('path')
require('dotenv').config()

const port = process.env.PORT || 8000;
const dbUrl = require("./config/keys").mongoDBUrl;
mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

const users = require('./routes/users')
const bikes = require('./routes/bikes');
const reservations = require('./routes/reservations');
const ratings = require('./routes/ratings')

app.use(cors())
app.use(express.json())

app.use('/api/users', users)
app.use('/api/bikes', bikes)
app.use('/api/reservations', reservations)
app.use('/api/ratings', ratings)

app.use(express.static(path.join(__dirname, '../client', 'build')));
app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Started the server on port ${port}`)
})