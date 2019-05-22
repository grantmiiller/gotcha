
function connectXssRoutes(clientApp) {

    clientApp.get('/xss/reflected-server', function(req, res) {
        let query = req.query.searchterm || false;
        res.render('xss/reflected-server-xss.html', { title: 'Server Reflected XSS', query: query })
    });

    clientApp.get('/xss/reflected-client', function(req, res) {
        res.render('xss/reflected-client-xss.html', { title: 'Client Reflected XSS' })
    });
}

module.exports = connectXssRoutes;