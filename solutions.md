### ***** SPOILERS *****
Solutions on how to solve the various pages

# XSS (Cross-site Scripting)
[Reflected XSS from Server](#reflected-server)

<a name="reflected-server"></a>
## [/xss/reflected-server](http://localhost:4000/xss/reflected-server)

You can make the input safe in this HTML context by entity-encoding the following characters in the user-provided input:

```
 & --> &amp;
 < --> &lt;
 > --> &gt;
 " --> &quot;
 ' --> &#x27;     
 / --> &#x2F;  
 ```

For example, rewriting the route to be:

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