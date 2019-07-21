const db = require('../../db.js');
const { sanitizeComments } = require('../../helpers/comments');

function renderComments(req, res) {
    db.getComments(function(comments) {
        const sanitizedComments = sanitizeComments(comments);
        res.render('xss/xss-3.html', { title: 'XSS 3', comments: sanitizedComments });
    });
}

function connectXssRoutes(clientApp) {

    clientApp.get('/xss/xss-1', function(req, res) {
        let query = req.query.searchterm || false;
        res.render('xss/xss-1.html', { title: 'XSS 1', query: query });
    });

    clientApp.get('/xss/xss-2', function(req, res) {
        res.render('xss/xss-2.html', { title: 'XSS 2' });
    });

    clientApp.get('/xss/xss-3', renderComments);

    clientApp.post('/xss/xss-3', function(req, res) {
        let { name, comment } = req.body;
        db.createComment(name, comment, function() {
            renderComments(req, res);
        });
    });

    clientApp.get('/xss/xss-4', function(req, res) {
        res.render('xss/xss-4.html', { title: 'XSS 4' });
    });
}

module.exports = connectXssRoutes;