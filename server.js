// Requirements
const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser')

// Config
const app = express();
app.use(bodyParser.json());
const data = new db();

// ROUTE ///////////
// Create
app.post('/user', async function (req, res) {
  let user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
  };
  console.log(user)
  let return__value = await data.addUser(user);
  res.send(return__value);
});
app.post('/post', async function (req, res) {
  let post = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author
  };
  console.log(post)
  let return__value = await data.addPost(post);
  res.send(return__value);
});

// Read
app.get('/users', async function (req, res) {
  let return__value = await data.users();
  res.send(return__value);
});

app.get('/user/:user', async function (req, res) {
  console.log(req.params.user)
  let return__value = await data.user(req.params.user);
  res.send(return__value);
});
app.get('/post/:user/', async function (req, res) {
  console.log(req.params.user)
  let return__value = await data.post(req.params.user);
  res.send(return__value);
});
// Update
app.put('/post', async function (req, res) {
  let post = {
    title: req.body.title,
    body: req.body.body,
    id: req.body.id
  };
  console.log(post)
  let return__value = await data.updatePost(post);
  res.send(return__value);
});
app.put('/user', async function (req, res) {
  let user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
    id: req.body.id
  };
  console.log(user)
  let return__value = await data.updateUser(user);
  res.send(return__value);
});

// Delete
app.delete('/user/:user/', async function (req, res) {
  console.log(req.params.user)
  let return__value = await data.deleteUser(req.params.user);
  res.send(return__value);
});
app.delete('/post/:id/', async function (req, res) {
  console.log(req.params.id)
  let return__value = await data.deletePost(req.params.id);
  res.send(return__value);
});

// //// ///////////

// Server Listen at...
app.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});


