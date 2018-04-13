var mongoose = require('mongoose');
var {PORT} = require('./../server.js');

mongoose.Promise = global.Promise;
var mongodb_uri = 'mongodb://naorzr:34543454@ds229008.mlab.com:29008/mongoose-for-nodejs-mongodb-puralsight';
var dbConnection = PORT!==3000 ?mongodb_uri:'mongodb://localhost:27017/TodoApp';
mongoose.connect(dbConnection);
console.log(`Connected to ${dbConnection}`)
module.exports = {mongoose};
