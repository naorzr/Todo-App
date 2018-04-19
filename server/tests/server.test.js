const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed.js');

beforeEach(populateTodos);
beforeEach(populateUsers);

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
            expect(todo).toBe(null);
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

describe('PATCH /todos/:id',() => {
  it('Should update the todo',(done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({
        completed:true,
        text:'Testing from atom'})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Testing from atom');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('Should clear completedAt when todo is not completed',(done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send({
        completed:false,
        text:'Second test from atom'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBe(null);
        expect(res.body.todo.completed).toBe(false);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated',(done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users',() => {
  var email = 'example@example.com';
  var password = "123mnb!";
  it('Should create a user',(done) => {
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('Should return a validation errors if request invalid',(done) => {
    request(app)
      .post('/users')
      .send({email: "invalid email",password: null})
      .expect(400)
      .end(done);
  });

  it('Should not create a user if email is in user', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email,
            password: 'Password123!'})
      .expect(400)
      .end(done);
  });

});
