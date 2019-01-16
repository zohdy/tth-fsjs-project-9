'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser').json;
const mongoose = require('mongoose');
const routes = require('./routes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

app.use(morgan('dev'));
app.use(bodyParser());

// DB Config
const db = require('./config/keys').mongoURI;


// Use Routes
app.get('/', (req, res) => res.redirect(('/api')));
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log(`Connected to Db ${db}`))
    .catch(err => console.log(`Error while trying to connect to ${db}, ${err}`));


