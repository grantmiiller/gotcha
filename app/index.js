const express = require('express');
const mustacheExpress = require('mustache-express');
const apiApp = express();
const clientApp = express();
const apiPort = 3000;
const clientPort = 4000;

const VIEW_PATH = __dirname + '/templates';

apiApp.get('/', (req, res) => res.send('Hello World!'));

clientApp.use('/assets', express.static('assets'))
clientApp.engine('html', mustacheExpress(VIEW_PATH, '.html'));
clientApp.set('view engine', 'mustache');
clientApp.set('views', VIEW_PATH);

clientApp.get('/', function(req, res) {
  let query = req.query.q || "";
  const jsRegExp = /^javascript:/g;
  if (query.match(/^javascript:/g)) {
    query = "#";
  }
  res.render('index.html', { title: 'Introduction', query: query });
});

apiApp.listen(apiPort, () => console.log(`api app listening on port ${apiPort}!`));
clientApp.listen(clientPort, () => console.log(`client app listening on port ${clientPort}!`));
