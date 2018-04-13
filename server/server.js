var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const PORT = process.env.PORT || 3000;



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

app.delete('/todos/:id',(req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('Invalid Id');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send('Id was not found');
    }
    res.send(`Successfuly removed by Id ${id}\n${todo}`);
  }).catch((e) => {
    res.status(400).send();
  });

});

module.exports = {app, PORT};
