### ***** SPOILERS *****
Solutions on how to solve the various pages

# XSS (Cross-site Scripting)
- [Reflected XSS from Server](#reflected-server)
- [Reflected XSS from Client](#reflected-client)

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