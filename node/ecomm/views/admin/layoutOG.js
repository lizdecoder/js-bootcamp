// layout for administration side of application
// content is the template we are selecting
module.exports = ({ content }) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;
};