const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');



//
// Todo.remove({}).then((result) => {
//   console.log(result);
// });


Todo.findByIdAndRemove('5acfa691d69f423a48bd335a').then((todo) => {
  console.log(todo);
});
