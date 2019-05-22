const express = require('express');

const apiApp = express();

apiApp.get('/', (req, res) => res.send('Hello World!'));

module.exports = apiApp;
