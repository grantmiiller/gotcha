### ***** SPOILERS *****
Solutions on how to solve the various pages

# XSS (Cross-site Scripting)
- [Reflected XSS from Server](#reflected-server)
- [DOM Based XSS](#dom-xss)
- [Reflected XSS from Client](#reflected-client)
- [React Reflected XSS](#reflected-react)

---
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

For example, rewrite the route in `app/client/routes/xss-routes` with the following to prevent the XSS attack.

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

To use DOMPurify, do the following in `app/helpers/comments.js`
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

Because we are updating the text using `innerHTML`, HTML can be injected. This can be fixed by updating the `updateGreeting` in `/app/assets/js/reflected-client-xss.js` to be the following:

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