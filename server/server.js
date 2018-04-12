var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var PORT = process.env.port || 3000;



app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

app.get('/todos/:id',(req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(400).send('Invalid Id');
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      res.status(404).send('Todo Id Was not found');
    }
    res.send(todo);
  }).catch((e) => console.log(e));
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos,
    })
  }, (e) => {
    res.status(400).send(e);
  })
});

module.exports = {app};
