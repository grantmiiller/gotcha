(function() {
    const e = React.createElement;

    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get('url') || '';

    function LinkSharer(props) {
        return e('a', { href: props.url }, "Your Friends Link!");
    }

    renderLink(url);

    // Sanitize passed url
    function renderLink(url) {
        if (url.match(/^javascript:/)) {
            url = '';   
        }
        ReactDOM.render(LinkSharer({ url }), document.getElementById('app'));
    }
})();