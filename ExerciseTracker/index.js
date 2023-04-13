const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose');


// connect to data base
mongoose.connect(process.env.MONGO_URI);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  }
}, 
{versionKey: false}
);

const User = mongoose.model('User', userSchema);

const exerciseSchema = mongoose.Schema({
  userId: { type: String, required: true },
	description: { type: String, required: true },
	duration: { type: Number, min: 1, required: true },
	date: { type: Date, default: Date.now },
  userId: {type: String, required: true}
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

app.use(cors())
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true} ));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//POST to /api/users
app.post('/api/users', async (req, res) => {
  const username = req.body.username;

  try{
    const foundUser = await User.findOne({username: username});

    if(foundUser) {
      return res.json(foundUser);
    }
    
    const user = await User.create({
      username: username
    });
    res.json(user);
    
  } catch(err) {
    console.error(err);
    res.status(500).json('Server error..');
  }
})

// GET request to /api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(err) {
    console.error(err);
    res.status(500).json('Server error..');
  }
})


//POST to /api/users/:_id/exercises
app.post('/api/users/:_id/exercises', async (req, res) =>{
  let {description, duration, date} = req.body;
  const userId = req.params._id;
  
  if(description == '') return res.json({message: 'description should not be empty'});

  if(duration == '')  return res.json({message: 'duration should not be empty'});
  else duration = parseInt(duration);
  
  try{
    const foundUser = await User.findById(userId);
    if(!foundUser) return res.json({message: 'No such that id'});
  
    if(!date) {
      date = new Date();
    }
    else {
      date = new Date(date);
    }
      
    const exercise = await Exercise.create({
      username: foundUser.username,
      description,
      duration,
      date,
      userId
    })
    
    res.json({
      username: foundUser.username,
      description,
      duration,
      _id: userId,
      date: date.toDateString()
    })
    
  }catch(err)
  {
    return console.log(err);
  }  
})


// GET request to /api/users/:_id/logs

app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;

  let {from, to, limit} = req.query;

  let filter = {userId}
  let dateFilter = {};
  if(from) {
    dateFilter['$gte'] = new Date(from);
  }

  if(to) {
    dateFilter['$lte'] = new Date(to);
  }

  if(from || to) filter.date = dateFilter;

  if(!limit) limit = 200;
  
  try{
    const foundUser = await User.findById(userId);
    if(!foundUser) return res.json({message: 'No such that id'});
    
    let exercises = await Exercise.find(filter)
      .limit(limit)
      .select({_id: 0, description: 1, duration: 1, date: 1});

    exercises = exercises.map((e) => {
      return {
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString()
      }
    });

    res.json({
      username: foundUser.username,
      count: exercises.length,
      _id: foundUser._id,
      log: exercises
    });
    
  } catch (err){
    console.log(err);
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
