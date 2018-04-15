var mongoose = require('mongoose');
var {PORT} = require('./../server.js');

mongoose.Promise = global.Promise;


mongoose.connect(process.env.MONGODB_URI);
console.log(`Connected to ${process.env.MONGODB_URI}`)
module.exports = {mongoose};
