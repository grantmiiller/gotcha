const db = require('../../db.js');
const { sanitizeComments } = require('../../helpers/comments');

function connectCsrfRoutes(clientApp) {
  clientApp.get('/csrf/csrf', function(req, res) {
    // This is for demo purposes only. Set session cookies when a user
    // logs in, use a cryptographically secure library to generate CSRF Tokens
    // and set max lifes and what not
    const session = req.cookies.sess;
    const csrfToken = req.cookies.csrf;

    if (!session || !csrfToken) {
      res.cookie('sess', '43275823-Jenny');
      res.cookie('csrf', '320950934Arandomandsecuretoken');
    }
    db.getComments(function(rows) {
      res.render('csrf/csrf.html', {
        title: 'CSRF Attacks',
        comments: rows,
        csrf: csrfToken,
      });
    });
  });

  clientApp.post('/csrf/csrf', function(req, res) {
    const session = req.cookies.sess;
    const csrfToken = req.cookies.csrf;
    let name;
    
    if (!session || !csrfToken) {
      return res.render('csrf/csrf.html', {
        title: 'CSRF Attacks',
        error: 'Unauthorized user detected',        
      });
    }

    try { 
      name = session.split('-')[1];
    } catch (e) {
      return res.render('csrf/csrf.html', {
        title: 'CSRF Attacks',
        error: 'Unauthorized user detected',        
      });
    }

    let { csrfToken: sentToken, comment } = req.body;

    // Uncomment below to prevent CSRF attack
    //if (sentToken !== csrfToken) {
    //  return res.render('csrf/csrf.html', {
    //    title: 'CSRF Attacks',
    //    error: 'CSRF tokens didn\'t match!. Something fishy happened!',
    //  });
    //}

    db.createComment(name, comment, function() {
      db.getComments(function(comments) {
          const sanitizedComments = sanitizeComments(comments);
          res.render('csrf/csrf.html', { title: 'CSRF Attacks', comments: sanitizedComments });
      });
    });
  });
}

module.exports = connectCsrfRoutes;
