const db = require('../db');
const express = require('express');
const router = express.Router();
const data = new db();
const session = require('express-session');
const request = require('request');


router.use('/api', require('./api'))
// router.use('/cars', require('./cars'))

router.get('/', async function (req, res, next) {
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
  console.log("Utente in sessione: ", req.session.user);
  res.render('home', { posts: return__value, user: req.session.user });
})
router.get('/login', function (req, res, next) {
  res.render('login');
})
router.get('/registration', function (req, res, next) {
  if (req.session.user_email == null) {
    console.log("Registrazione di", req.body);
    res.render('registration');
  } else {
    res.redirect('back')
  }
})
router.get('/addPost', isLoggedIn, function (req, res, next) {
  res.render('addPost');
})
router.get('/modPost/:id', isLoggedIn, async function (req, res, next) {
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
router.post('/modPost/', isLoggedIn, isAuthor, async function (req, res, next) {
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
    id: req.session.post.post_id,
    author: req.session.user.email
  }
  console.log("post in POST modpost", modPost);
  const postNuovo = await data.updatePost(modPost);
  console.log(postNuovo[0]);
  return res.redirect('/profile');
  // res.render('ok', { title: postNuovo[0].id });
})

router.post('/addPost', isLoggedIn, async function (req, res, next) {
  console.log("Vorrei aggiungere post come...", req.session.user_email);

  let post = {
    title: req.body.title,
    body: req.body.body,
    author: req.session.user_id
  };

  console.log(post)
  let return__value = await data.addPost(post);
  // res.json(return__value);
  return res.redirect('/profile');
})

router.get('/about', function (req, res, next) {
  res.send('Learn about us')
})
router.get('/profile', async function (req, res, next) {
  let user = await data.getUserInfo(req.session.user_email);
  let posts = await data.getUserPost(req.session.user_email);
  console.log(posts)
  res.render('profile', { user: user[0], posts: posts })
})

router.post('/signup', async function (req, res, next) {
  if (req.body.pass1 != req.body.pass2) {
    res.send("Error");
    return res.redirect("..");
  }
  const user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.pass1
  };
  console.log(user)
  const UserReg = await data.addUser(user);
  if (UserReg == undefined) {
    return res.send("Errore");
  } else {
    // console.log("signup ", UserReg[0].email)
    req.session.user_email = UserReg[0].email;
    req.session.user_id = UserReg[0].id;
    req.session.user = UserReg[0];
    return res.redirect('/profile')
  }
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
  req.session.user = user;
  req.session.user_email = user.email;
  req.session.user_id = user.id;
  console.log(req.session.user_id);
  return res.redirect('/profile');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.session.user_email = null;
  req.session.user_id = null;
  req.session.user = undefined;
  return res.redirect('back');
});
router.get('/delete/:id', isLoggedIn, async function (req, res, next) {
  let id = req.params.id;
  console.log("Post da cancellare", id);
  await data.deletePost(id);
  return res.redirect('back');
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