const apiApp = require('./api/api-app.js');
const clientApp = require('./client/client-app.js');

const db = require('./db.js');

const apiPort = 3000;
const clientPort = 4000;

apiApp.listen(apiPort, () => console.log(`api app listening on port ${apiPort}!`));
clientApp.listen(clientPort, () => console.log(`client app listening on port ${clientPort}!`));
