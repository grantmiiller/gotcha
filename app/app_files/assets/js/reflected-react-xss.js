(function() {
    const e = React.createElement;

    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get('url') || '';

    function LinkSharer(props) {
        const url = props.url;
        return e('a', { href: url }, "Your Friends Link!");
    }

    renderLink(url);

    // Sanitize passed url
    function renderLink(url) {
        ReactDOM.render(LinkSharer({ url }), document.getElementById('app'));
    }
})();