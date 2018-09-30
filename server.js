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

app.listen(4000, function () {
  console.log('Server is running.. on Port 4000');
});


