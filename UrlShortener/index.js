require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

// conect to a database
mongoose.connect(process.env.MONGO_URI);

// create Schema for url
const shortUrlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});
// schema into model
const shortUrls = mongoose.model('ShortUrl', shortUrlSchema );

app.use(cors());

//mount the url encoded
app.use(express.urlencoded({ extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;

  // check if url is valid
  if(!/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(url)) {
    return res.json({ error: "invalid url" })
  }

  try {
    let foundUrl = await shortUrls.findOne({original_url: url});

    if(foundUrl) {
      res.json({
        original_url: foundUrl.original_url,
        short_url:  foundUrl.short_url  
      });
    }
    else {
      let count = await shortUrls.countDocuments({});

      let foundUrl =  new shortUrls({
        original_url: url,
        short_url:  count 
      });

      await foundUrl.save();
      
      res.json({
        original_url: foundUrl.original_url,
        short_url:  foundUrl.short_url  
      });
      
    }
  } catch(err) {
    console.error(err);
    res.status(500).json('Server error..');
  }
  
});

app.get('/api/shorturl/:urlParam?', async (req, res) => {
  try{
    const data = await shortUrls.findOne({short_url: req.params.urlParam});
    
    if(data) return res.redirect(data.original_url);
    return res.status(404).json('No URL found');
  } catch(err) {
    console.error(err);
    res.status(500).json('Server error..');
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
