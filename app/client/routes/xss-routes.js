const db = require('../../db.js');

function renderComments(req, res) {
    db.getComments(function(comments) {
        const sanitizedComments = comments.map(function(row) {
            return {
                name: row.name.replace('<script>', ''),
                comment: row.comment.replace('<script>', ''),
            };
        });
        res.render('xss/dom-xss.html', { title: 'DOM XSS', comments: sanitizedComments });
    });
}

function connectXssRoutes(clientApp) {

    clientApp.get('/xss/reflected-server', function(req, res) {
        let query = req.query.searchterm || false;
        res.render('xss/reflected-server-xss.html', { title: 'Server Reflected XSS', query: query })
    });

    clientApp.get('/xss/dom', renderComments);

    clientApp.post('/xss/dom', function(req, res) {
        let { name, comment } = req.body;
        db.createComment(name, comment, function() {
            renderComments(req, res);
        });
    });

    clientApp.get('/xss/reflected-client', function(req, res) {
        res.render('xss/reflected-client-xss.html', { title: 'Client Reflected XSS' })
    });
}

module.exports = connectXssRoutes;