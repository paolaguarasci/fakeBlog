const db = require('./db');
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());

app.get('/:user/post/:id', function (req, res) {

  let query = {
    user: req.params.user,
    post: req.params.id
  }
  console.log(query.user, query.id)
  db.read(`SELECT title, body, nickname
      FROM posts JOIN users on (posts.author = users.users_id)
      WHERE users.nickname = '${query.user}'
      AND posts.post_id = ${query.post};`)
    .then(
      (data) => {
        if (data != undefined) res.send(data.rows);
      }
    ).catch(err => console.error(err));
});

app.get('/:user', function (req, res) {
  let query = req.params.user
  console.log(query)
  db.read(`SELECT title, body, nickname
      FROM posts
      JOIN users on (posts.author = users.users_id)
      WHERE users.nickname = '${query}';`)
    .then(
      (data) => {
        res.send(data.rows);
      }
    ).catch(err => console.error(err));
});

app.put('/:user/', async function (req, res) {
  let query = {
    user: req.params.user,
    title: req.body.post.title,
    post: req.body.post.body
  }
  let id = await db.read(`SELECT users_id FROM users WHERE nickname = '${query.user}'`)
  id = id.rows[0].users_id
  console.log(query.title, query.post, id)
  let r = await db.insert(`INSERT INTO posts VALUES('${query.title}', '${query.post}', ${id});`)
  if (r) {
    res.send("Inserimento ok");
  }
});

app.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});


