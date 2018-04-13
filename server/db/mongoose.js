var mongoose = require('mongoose');
var {PORT} = require('./../server.js');

mongoose.Promise = global.Promise;
var mongodb_uri = 'mongodb://naorzr:34543454@ds229008.mlab.com:29008/mongoose-for-nodejs-mongodb-puralsight';
var localDb = 'mongodb://localhost:27017/TodoApp'
var dbConnection = process.env.mongodb_uri || localDb;
mongoose.connect(dbConnection);
console.log(`Connected to ${dbConnection}`)
module.exports = {mongoose};
