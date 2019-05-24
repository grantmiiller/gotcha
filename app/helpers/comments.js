function sanitizeComments(comments) {
    return comments.map(function(row) {
        const regexCleaner = /<(script|img).*?>/g;
        return {
            name: row.name.replace(regexCleaner, ''),
            comment: row.comment.replace(regexCleaner, ''),
        };
    });
}

module.exports = {
    sanitizeComments: sanitizeComments, 
};