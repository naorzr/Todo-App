var mongoose = require('mongoose');
var {PORT} = require('./../server.js');

mongoose.Promise = global.Promise;


mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err){
    console.log(`Unable to establish a connection to ${process.env.MONGODB_URI}`);
  }
  else {
    console.log(`Connected to ${process.env.MONGODB_URI}`)
  }
});

module.exports = {mongoose};
