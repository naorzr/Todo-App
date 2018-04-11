const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ace37a1592965314c42225d';
var userId = '5ace3da6796d173918b1fc7a';

if (!ObjectID.isValid(id) || !ObjectID.isValid(userId)){
  return console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos',todos);
// })
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo',todo);
// })

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo by Id',todo);
}).catch((e) => console.log(e));

User.findById(userId).then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log('User by id',user);
}).catch((e) => console.log(e));
