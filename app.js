const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const path = require('path');

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(session({
  secret: process.env.secret,
  resave: true,
  saveUninitialized: true
}));


app.response.message = function (msg) {
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};


app.use(require('./routes'));
app.use(express.static(path.join(__dirname, 'public')))




// Start
app.listen(4000);