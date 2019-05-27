### ***** SPOILERS *****
Solutions on how to solve the various pages

## XSS (Cross-site Scripting)
- [Reflected XSS from Server](#reflected-server)
- [DOM Based XSS](#dom-xss)
- [Reflected XSS from Client](#reflected-client)
- [React Reflected XSS](#reflected-react)


## SQL Injection
- [Login Injection](#login-injection)
- [Get Injection](#get-injection)


## SSRF(Server-side Request Forgery) 
- [Internal Network SSRF](#internal-network)
---

# XSS

<a name="reflected-server"></a>
## [/xss/reflected-server](http://localhost:4000/xss/reflected-server)

### How to execute
Enter `<script>alert(1)</script>` into the search input and hit enter

### How to fix
You can make the input safe in this HTML context by entity-encoding the following characters in the user-provided input:

```
 & --> &amp;
 < --> &lt;
 > --> &gt;
 " --> &quot;
 ' --> &#x27;     
 / --> &#x2F;  
 ```

For example, rewrite the route in `client/routes/xss-routes` with the following to prevent the XSS attack.

```
clientApp.get('/xss/reflected-server', function(req, res) {
  let query = req.query.searchterm || false;
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }
  if (query) {
    query = escapeHtml(query);
  }
  res.render('xss/reflected-server-xss.html', { title: 'Introduction', query: query })
});
```

<a name="dom-xss"></a>
## [/xss/dom](http://localhost:4000/xss/dom)

### How to execute
Just drop a `<scri<script>pt>alert(1)</script>` in either field

### How to fix
Really, the best way to fix this is to use a tested dom sanitizing library such as `DOMPurify` to sanitize the input. Or entity-encode the characters mentioned above and not allow users to render HTML tags.

To use DOMPurify, do the following in `helpers/comments.js`
```
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

function sanitizeComments(comments) {
    return comments.map(function(row) {
        return {
            name: DOMPurify.sanitize(row.name),
            comment: DOMPurify.sanitize(row.comment),
        };
    });
}
```

<a name="reflected-client"></a>
## [/xss/reflected-client](http://localhost:4000/xss/reflected-client)

### How to execute
Luckily, `innerHTML` isn't supposed to execute script tags. But we can still execute our code by entering `<img src="" onerror="alert(1)" />` as input.

### How to fix

Because we are updating the text using `innerHTML`, HTML can be injected. This can be fixed by updating the `updateGreeting` in `/assets/js/reflected-client-xss.js` to be the following:

```
function updateGreeting(friend) {
    greetingDOM.textContent = `Hi ${friend}!`;
}
```


<a name="reflected-react"></a>
## [/xss/reflected-react](http://localhost:4000/xss/reflected-react)

### How to execute
Enter `javascript:alert(1)` into the input field and submit. Then click on the link.

### How to fix
Just checking for `javascript:` at the beginning of the passed string isn't enough, since there are ways to pass that filter such as `jaVAScript:` or adding a bunch of spaces before `javascript:`.

The best way to make sure your link is safe is to check for `https:` at the beginning of the string and drop anything else.
```
if (!url.match(/^https?:/i)) {
    url = '';   
}
```

# Injection

<a name="login-injection"></a>
## [/injection/login](http://localhost:4000/injection/login)

### How to execute
Enter `" or 1=1 --` into the `Username` field and submit.
This works because the SQL statement looks like this `SELECT username FROM users WHERE username = "' + username + '" AND password = "' + password + '"'` so when we enter `" or 1=1 --` the statement ends up looking like this: `SELECT username FROM users WHERE username = "" or 1=1 --" AND password = ""` which really translates to `SELECT username FROM users WHERE username = "" or 1=1 --`.

### How to fix
One, we shouldn't be storing unhashed passwords. But we can fix this situation by using a prepared statement instead. This can be done by turning the route into:

```
clientApp.post('/injection/login', function(req, res) {
  const { username, password} = req.body;
  const sqlQuery = db.prepare("SELECT username FROM users WHERE username = ? and password = ?");

  sqlQuery.get([username, password], function(err, row) {
      res.render('injection/login-injection.html', {
          title: 'Login Injection',
          username: row ? row.username : null,
      });
  })
});
```

<a name="get-injection"></a>
## [/injection/get](http://localhost:4000/injection/get)

### How to execute
Append ` AND (SELECT 1 FROM users WHERE LIKE("a%25", username)%3d1)%3d1` to the end of a working url, for instance `http://localhost:4000/injection/get/2%20AND%20(SELECT%201%20FROM%20users%20WHERE%20LIKE(%22a%25%22,%20username)%3d1)%3d1`.

This works because we are running a true statement, so the site still returns the comment. If we run a false statement, such as `http://localhost:4000/injection/get/2%20AND%201=2` the comment won't be found.

### How to Fix
This can also be fixed using a prepared statement like above. However, if for whatever reason you would need to make a dynamic query, the best thign to do is only use whitelisted values and not the user provided ones, or make sure the input is exactly what you expect it to be.

For instance, we can prevent this SQL injection by converting the input to an integer.

```
clientApp.get('/injection/get/:id', function(req, res) {
    const id = parseInt(req.params.id, 10);
    const sqlQuery = 'SELECT * FROM comments WHERE id = ' + id;

    if(isNaN(id)) {
        res.redirect('/injection/get');
    } else {
        db.get(sqlQuery, function(err, row) {
            res.render('injection/get-injection.html', {
                title: 'Login Injection',
                comment: row,
                id: id,
            });
        });
    }
});
```

# SSRF

<a name="internal-network"></a>
## [/ssrf/internal-network](http://localhost:4000/injection/get)

### How to execute
You access the super secret endpoint by entering `http://localhost:3000` in the input field and submitting

### How to fix

SSRF is difficult to prevent. The best way to do it is not to make requests using user input. However, if you must, the next best thing is to only allow requests to a whitelisted number of domains. You should also validate the path of url is something you expect and limit the number of requests a user can make since a user could use your servers to attack someone else's.