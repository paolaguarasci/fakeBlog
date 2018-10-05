const db = require('../db');
const express = require('express');
const router = express.Router();
const data = new db();
// Routes public
router.get('/posts/', isLoggedIn, async function (req, res) {
  let return__value = await data.post(req.session.user_id);
  res.json(return__value);
});
// router.get('/posts/', isLoggedIn, async function (req, res) {
//   let return__value = await data.latest20Post();
//   res.json(return__value);
// });
router.post('/posts/', isLoggedIn, async function (req, res) {
  let post = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author
  };
  let return__value = await data.addPost(post);
  res.json(return__value);
});

router.put('/posts/', isLoggedIn, async function (req, res) {
  let post = {
    title: req.body.title,
    body: req.body.body,
    id: req.body.id
  };
  console.log(post)
  let return__value = await data.updatePost(post);
  res.json(return__value);
});

router.delete('/posts/:nick/', isLoggedIn, async function (req, res) {
  let return__value = await data.deletePost(req.params.nick);
  res.json(return__value);
});


router.post('/users/', isLoggedIn, async function (req, res) {
  let user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
  };
  let return__value = await data.addUser(user);
  res.json(return__value);
});

router.get('/users/', isLoggedIn, async function (req, res) {
  let return__value = await data.users();
  res.json(return__value);
});

router.get('/user/:user', isLoggedIn, async function (req, res) {
  let return__value = await data.user(req.params.user);
  res.json(return__value);
});


router.put('/user/', isLoggedIn, async function (req, res) {
  let user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
    id: req.body.id
  };
  let return__value = await data.updateUser(user);
  res.json(return__value);
});

// Delete
router.delete('/user/:user/', isLoggedIn, async function (req, res) {
  let return__value = await data.deleteUser(req.params.user);
  res.json(return__value);
});


// Middleware
function isLoggedIn(req, res, next) {
  req.body.author = req.session.user;
  if (!(req.session && req.session.user_email)) {
    return res.send('Not logged in!');
  }
  next();
}

module.exports = router;
