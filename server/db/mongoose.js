var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var mongodb_uri = 'mongodb://<dbuser>:<dbpassword>@ds229008.mlab.com:29008/mongoose-for-nodejs-mongodb-puralsight';

mongoose.connect(mongodb_uri || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
