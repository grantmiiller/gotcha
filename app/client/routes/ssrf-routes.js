const request = require('request');

function connectSsrfRoutes(clientApp) { 
    clientApp.get('/ssrf/internal-network', function(req, res) {
        let url = req.query.url || false;
        if (!url) {
           // Render 
            res.render('ssrf/internal-network-ssrf.html', {
                title: 'React Reflected XSS'
            });
        } else {
            request(url, function(err, response, body) {
                if (!response || response.statusCode !== 200) {
                    res.render('ssrf/internal-network-ssrf.html', {
                        title: 'React Reflected XSS',
                        err: 'We couldn\'t get your site',
                    });
                } else {
                    res.render('ssrf/internal-network-ssrf.html', {
                        title: 'React Reflected XSS',
                        body: body,
                    });
                }
            });
        }
    });
}

module.exports = connectSsrfRoutes;
