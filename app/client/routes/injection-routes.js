const { db, getComments } = require('../../db.js');

function connectInjectionRoutes(clientApp) {
    clientApp.get('/injection/login', function(req, res) {
        res.render('injection/login-injection.html', {
            title: 'Login Injection',
        });
    });

    clientApp.post('/injection/login', function(req, res) {
        const { username, password} = req.body;

        const sqlQuery = 'SELECT username FROM users WHERE username = "' + username + '" AND password = "' + password + '"';

        db.get(sqlQuery, function(err, row) {
            res.render('injection/login-injection.html', {
                title: 'Login Injection',
                username: row ? row.username : null,
            });
        });
    });


    clientApp.get('/injection/get/:id', function(req, res) {
        const { id } = req.params;
        const sqlQuery = 'SELECT * FROM comments WHERE id = ' + id;

        db.get(sqlQuery, function(err, row) {
            res.render('injection/get-injection.html', {
                title: 'Login Injection',
                comment: row,
                id: id,
            });
        });
    });

    clientApp.get('/injection/get', function(req, res) {
        getComments(function(rows) {
            res.render('injection/get-injection.html', {
                title: 'Get Injection',
                comments: rows,
            });
        });
    });
}

module.exports = connectInjectionRoutes;