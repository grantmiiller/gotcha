const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const escapeHTML = require('../helpers/dom-escape');

const clientApp = express();
const VIEW_PATH = path.resolve(__dirname + '/../templates');

clientApp.use('/assets', express.static('assets'))
clientApp.engine('html', mustacheExpress(VIEW_PATH, '.html'));
clientApp.set('view engine', 'mustache');
clientApp.set('views', VIEW_PATH);

clientApp.get('/xss/reflected-server', function(req, res) {
  let query = req.query.searchterm || false;
  if (query) {
    query = escapeHTML(query);
  }
  res.render('xss/reflected-server-xss.html', { title: 'Introduction', query: query })
});


clientApp.get('/', function(req, res) {
  res.render('index.html', { title: 'Welcome to Gotchas' });
});

module.exports = clientApp;
