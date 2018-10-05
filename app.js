const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
app.use(require('./routes'));

// Access the session as req.session
app.get('/', function (req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})

app.listen(4000);