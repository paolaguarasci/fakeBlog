const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const path = require('path');

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
app.use(require('./routes'));
app.use(express.static(path.join(__dirname, 'public')))

// Start
app.listen(4000);