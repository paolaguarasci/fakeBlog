const db = require('../db');
const express = require('express');
const router = express.Router();
const data = new db();
const crypto = require('crypto');
router.use('/api', require('./api'))

router.get('/', async function (req, res, next) {
  let return__value = await data.latest20Post();

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
  if (req.session.post == null) {
    const p = await data.singlePost(req.params.id);
    const m = await data.getEmail(p[0].author);
    let post = {
      title: p[0].title,
      body: p[0].body,
      post_id: p[0].id,
      author: m[0].email
    };
    req.session.post = post;
  }
  console.log("post in get modpost", req.session.post);
  res.render('modPost', req.session.post);
})
router.post('/modPost/', isLoggedIn, isAuthor, async function (req, res, next) {
  console.log("body: ", req.body);
  let modPost = {
    title: req.body.newTitle,
    body: req.body.newBody,
    id: req.session.post.post_id,
    author: req.session.user.email
  }
  console.log("post in POST modpost", modPost);
  const postNuovo = await data.updatePost(modPost);
  req.session.post = null;
  console.log(postNuovo[0]);
  return res.redirect('/profile');
  // res.render('ok', { title: postNovo[0].id });
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
router.get('/profile', isLoggedIn, async function (req, res, next) {
  let user = await data.getUserInfo(req.session.user_email);
  let posts = await data.getUserPost(req.session.user_email);
  console.log(posts)
  res.render('profile', { user: user[0], posts: posts })
})
router.get('/editUser', isLoggedIn, async function (req, res, next) {
  let user = await data.getUserInfo(req.session.user_email);
  res.render('editUser', { user: user[0] })
})
router.post('/editUser', isLoggedIn, async function (req, res, next) {
  let asd = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: getHash(req.body.pass1),
    id: req.session.user_id
  };

  const newUser = await data.updateUser(asd);
  let user = await data.getUserInfo(req.session.user_email);
  res.render('editUser', { user: user[0] })
})

router.post('/signup', async function (req, res, next) {
  if (req.body.pass1 != req.body.pass2) {
    // res.send("Error");
    return res.render('home', { error: true });
  }
  const user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: getHash(req.body.pass1)
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
  let pass = getHash(req.body.pass);
  const user = await data.findOne({ Email: email });
  console.log(req.body.pass, pass, user.password)
  if (!user || user.password != pass) return res.render('login');
  console.log("Ciao", user)
  req.session.user = user;
  req.session.user_email = user.email;
  req.session.user_id = user.id;
  console.log(req.session.user_id);
  return res.redirect('..');
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
    return res.redirect('/login');
  }

  next();
}

function isAuthor(req, res, next) {
  console.log("req in isAuth: ", req.body);
  if (req.session.user_email != req.session.post.author) {
    console.log(req.session.user_email, req.body.author)
    return res.render('error', { msg: "You can't mod this post!!!" });
  }
  next();
}

function getHash(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}
module.exports = router