require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;
const bodyParser = require('body-parser')

const urlSchema = new Schema({
  original_url: String,
  short_url: String
});

const ShortUrl = mongoose.model("ShortUrl", urlSchema);
const url_pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    

app.use(bodyParser.urlencoded({ extended: false}));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
});
// Basic Configuration
const port = process.env.PORT || 3000;
// const options = {
//   family: 6,
//   hints: dns.ADDRCONFIG | dns.V4MAPPED,
// };
// dns.lookup('example.com', options, (err, address, family) =>
//   console.log('address: %s family: IPv%s', address, family));

const getHash = input =>{
  return crypto.createHash("sha1").update(input).digest('hex')
}

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", (req, res) => {
  let url = req.body.url;

  if (!url_pattern.test(url)){
    res.json({error: "invalid url"});
    return
  }

  if (dns.lookup(url, (err, address, family) => address)){
    let hashed = getHash(url);

    let obj = {
      original_url: url,
      short_url: hashed  
    };

    let newUrl = ShortUrl(obj);

    newUrl.save((err, data) => {
      if (err) return console.error(err);
      console.log(data)
      // done(null, data);
    });

    res.json(obj);
  }

});

app.get("/api/shorturl/:shortened_url", (req, res) => {
  // Person.findOne({favoriteFoods: food}, (err, data) => {
  //   if (err) return console.error(err);
  //   done(null, data);
  // });
  ShortUrl.findOne({short_url: req.params.shortened_url}, (err, data) => {
    if (err) { 
      console.error(err);
      res.json({ 
        error: "invalid url"
      });
      return;
    };
    console.log(data);
    // const url_pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if(url_pattern.test(data.original_url)){
      
      res.redirect(data.original_url)
      console.log("valid url")
    } else {
      console.log("invalid url")
      res.json({ 
        error: "invalid url"
      });
    }
    // done(null, data);
  });
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
