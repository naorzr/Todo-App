const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

const users = [
  {
    email: "First test user"
  },
  {
    email: 'Second test user'
  }
];

beforeEach((done) => {
  User.remove({}).then(() => {
    User.insertMany(users);
  })

  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new Todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) =>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
})

describe('GET /todos/:id',() => {
  it('Should return todo doc',(done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end(done);
  });
  var dummyId = new ObjectID();
  it('Should return a 404 if todo not found',(done) => {
    request(app)
      .get(`/todo/${dummyId.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids',(done) => {
    request(app)
      .get('/todo/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id',() => {
  it('Should remove a todo',(done) => {
      var hexId = todos[0]._id.toHexString();

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo) => {
            expect(todo).toBeNull();
            done();
          }).catch((e) => done(e));
        });
  });

  it('Should return 404 if todo not found',(done) => {
    var dummyId = new ObjectID().toHexString();

    request(app)
      .delete(`/todo/${dummyId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if ObjectId is invalid',(done) => {
    request(app)
      .delete('/todo/123')
      .expect(404)
      .end(done);
  });
});
