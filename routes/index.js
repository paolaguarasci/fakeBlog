const db = require('../db');
const express = require('express');
const router = express.Router();
const data = new db();
const session = require('express-session');
const path = require("path");



router.use('/api', require('./api'))
// router.use('/cars', require('./cars'))

router.get('/', async function (req, res) {
  let return__value = await data.latest20Post();
  res.json(return__value);
})
router.get('/login', function (req, res) {
  res.sendFile(path.resolve('./login.html'));
})
router.get('/addPost', isLoggedIn, function (req, res) {
  res.sendFile(path.resolve('./addPost.html'));
})
router.post('/addPost', isLoggedIn, async function (req, res) {
  console.log("Vorrei aggiungere post come...", req.session.user_email);

  let post = {
    title: req.body.title,
    body: req.body.body,
    author: req.session.user_id
  };

  console.log(post)
  let return__value = await data.addPost(post);
  res.json(return__value);
  // do somethings
})

router.get('/about', function (req, res) {
  res.send('Learn about us')
})

router.post('/signup', function (req, res, next) {
  var user = {
    Name: req.body.name,
    Email: req.body.email,
    Pass: req.body.pass,
    Num: req.body.num
  };
  var UserReg = mongoose.model('UserReg', RegSchema);
  UserReg.create(user, function (err, newUser) {
    if (err) return next(err);
    req.session.user_email = email;
    return res.send('Logged In!');
  });
});

router.post('/login', async function (req, res, next) {
  // console.log(req.params[0]);
  let email = req.body.email;
  let pass = req.body.pass;
  // console.log(req.body)
  const user = await data.findOne({ Email: email, Pass: pass });
  console.log("Ciao", user)
  // if (err) return next(err);
  if (!user) return res.send('Not logged in!');
  req.session.user_email = user.email;
  req.session.user_id = user.id;
  res.send('Logged In!');
  console.log(req.session.user_id);
  next()
});

router.get('/logout', isLoggedIn, function (req, res) {
  req.session.user_email = null;
  req.session.user_id = null;

});

// Middleware
function isLoggedIn(req, res, next) {
  req.body.author = req.session.user;
  if (!(req.session && req.session.user_email)) {
    return res.send('Not logged in!');
  }
  next();
}

module.exports = router