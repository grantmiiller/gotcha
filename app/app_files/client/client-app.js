const express = require('express');
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser')
const path = require('path');
const connectXssRoutes = require('./routes/xss-routes');
const connectCsrfRoutes = require('./routes/csrf-routes');
const connectSsrfRoutes = require('./routes/ssrf-routes');
const connectInjectionRoutes = require('./routes/injection-routes');
const { resetDB } = require('../db');

const clientApp = express();
const VIEW_PATH = path.resolve(__dirname + '/../templates');

clientApp.use('/assets', express.static('app_files/assets'))
clientApp.use(express.json());
clientApp.use(express.urlencoded({ extended: true }));
clientApp.use(cookieParser());
clientApp.engine('html', mustacheExpress(VIEW_PATH, '.html'));
clientApp.set('view engine', 'mustache');
clientApp.set('views', VIEW_PATH);

connectXssRoutes(clientApp);
connectInjectionRoutes(clientApp);
connectCsrfRoutes(clientApp);
connectSsrfRoutes(clientApp);

clientApp.get('/', function(req, res) {
  res.render('index.html', { title: 'Welcome to Gotchas' });
});

clientApp.get('/resetDB', function(req, res) {
  resetDB(function() {
    res.send('Database reset');
  });
})

module.exports = clientApp;
