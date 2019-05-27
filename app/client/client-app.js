const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const connectXssRoutes = require('./routes/xss-routes');
const connectCsrfRoutes = require('./routes/csrf-routes');
const connectSsrfRoutes = require('./routes/ssrf-routes');
const connectInjectionRoutes = require('./routes/injection-routes');

const clientApp = express();
const VIEW_PATH = path.resolve(__dirname + '/../templates');

clientApp.use('/assets', express.static('assets'))
clientApp.use(express.json());
clientApp.use(express.urlencoded({ extended: true }));
clientApp.engine('html', mustacheExpress(VIEW_PATH, '.html'));
clientApp.set('view engine', 'mustache');
clientApp.set('views', VIEW_PATH);

connectXssRoutes(clientApp);
connectInjectionRoutes(clientApp);
connectSsrfRoutes(clientApp);

clientApp.get('/', function(req, res) {
  res.render('index.html', { title: 'Welcome to Gotchas' });
});

module.exports = clientApp;
