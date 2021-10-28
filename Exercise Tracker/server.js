const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require("dotenv").config();
const cors = require('cors')

const mongodb = require('mongodb')
const mongoose = require('mongoose')

// connecting to mongodb
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creating our schemas
const Schema = mongoose.Schema;
const exerciseUsers = new Schema({
  username: {type: String, required: true},
  exercise: [{
    _id: false,
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

// new models
const ExerciseUsers = mongoose.model('ExerciseUsers', exerciseUsers);


//Post New User
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  ExerciseUsers.create({username: username}, (err, data) => {
    err ? res.send("Error") : res.send({username: data.username, _id: data._id})
  });
});

//Get all users
app.get('/api/users', (req, res) => {
  ExerciseUsers.find({}).select('username _id').exec((err, data) => {
    if(err) console.log(err);
    res.send(data);
  })
})

///Adding a new exercise to user
app.post('/api/users/:_id/exercises', (req, res) => {
  
  let {description, duration} = req.body
  
  ExerciseUsers.findOneAndUpdate({_id: req.params._id}, {
    $push: {
      exercise: {
        description: description,
        duration: Number(duration),
        date: req.body.date ?
        new Date(req.body.date).toDateString() :
        new Date().toDateString()
      }
    }
  }, {new: true}, (err, data) => {
    if(data == null) {
      res.json("Invalid input. Please try again")
    } else {
      res.json({
        username: data.username,
        description: description,
        duration: Number(duration),
        _id: data._id,
        date: req.body.date ?
        new Date(req.body.date).toDateString() :
        new Date().toDateString()
      });
    }
  })
})

//Retrieving exercises
app.get('/api/users/:_id/logs', (req, res) => {

  // We retrieve the logs from the db
  let userId = req.params._id;  
  let from = req.query.from !== undefined ? new Date(req.query.from) : null
  let to = req.query.to !== undefined ? new Date(req.query.to) : null
  let limit = parseInt(req.query.limit)
  
  ExerciseUsers.findOne({_id: userId}, (err, data) => {
    
    let count = data.exercise.length;
    
    if(data == null) {
      res.send("Could not find user.")
    } else {
      if(from && to) {
        res.send({
          _id: userId,
          username: data.username,
          count: limit || count,
          log: data.exercise.filter(e => e.date >= from && e.date <= to)
                            .slice(0, limit || count)
        })
      } else {
        res.send({
          _id: userId,
          username: data.username,
          count: limit || count,
          log: data.exercise.slice(0, limit || count)
        })
      }
    }
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

/*const callback = (err, data) => {
    err ? console.log(err) : console.log(data);
  }*/
