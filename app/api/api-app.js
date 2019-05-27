const express = require('express');

const apiApp = express();

apiApp.get('/', (req, res) => res.send('The super secret token with access to everything is: "LuckilyNoOneWillSeeThisOhSoSecret"'));

module.exports = apiApp;
