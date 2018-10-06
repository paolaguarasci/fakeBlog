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
  // return_value.forEach(post => { post.author = await data.getEmail(post.author); });

  for (let i in return__value) {
    let email = await data.getEmail(return__value[i].author);
    try {
      return__value[i].author = email[0].email;
    } catch (e) {
      return__value[i].author = "User non registrato";
      console.log('Error: user not found')
    }
  }
  console.log(return__value);
  res.render('home', { posts: return__value });
})
router.get('/login', function (req, res) {
  res.render('login');
})
router.get('/addPost', isLoggedIn, function (req, res) {
  res.render('addPost');
})
router.get('/modPost/:id', isLoggedIn, async function (req, res) {
  const p = await data.singlePost(req.params.id);
  const m = await data.getEmail(p[0].author);
  let post = {
    title: p[0].title,
    body: p[0].body,
    post_id: p[0].id,
    author: m[0].email
  };
  req.session.post = post;
  console.log("post in get modpost", post);
  res.render('modPost', post);
})
router.post('/modPost/', isLoggedIn, isAuthor, async function (req, res) {
  // const post = await data.singlePost(req.params.id);
  // let post = {
  //   title: req.body.title,
  //   body: req.body.body,
  //   post_id: req.param.id,
  //   author: req.session.user_id
  // };
  console.log("body: ", req.body);
  let modPost = {
    title: req.body.newTitle,
    body: req.body.newBody,
    id: req.body.id
  }
  const postNuovo = await data.updatePost(modPost);
  console.log(postNuovo[0]);
  res.render('ok', { title: postNuovo[0].id });
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
  // console.log("body: ", req.body);

  if (!(req.session && req.session.user_email)) {
    return res.send('Not logged in!');
  }

  next();
}

function isAuthor(req, res, next) {
  console.log("req in isAuth: ", req.body);
  if (req.session.user_email != req.session.post.author) {
    console.log(req.session.user_email, req.body.author)
    return res.send("You can't mod this post!!!");
  }
  next();
}

module.exports = router