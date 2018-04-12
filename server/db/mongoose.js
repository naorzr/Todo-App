var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var mongodb_uri = 'mongodb://naorzr:34543454@ds229008.mlab.com:29008/mongoose-for-nodejs-mongodb-puralsight';

mongoose.connect(mongodb_uri);

module.exports = {mongoose};
