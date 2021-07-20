const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const router = express.Router();
const appRoutes = require('./routes/api')(router);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/vuexTest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err) {
  if(err) {
    console.log('Not connected to db: ' + err);
  } else {
    console.log('Connected to MongoDB');
  }
});

module.exports = app;