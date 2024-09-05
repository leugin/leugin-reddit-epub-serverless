const {sanitizedHtml} = require("./html_tools");

const extractPageOfPost = (post) => {

    return {
        title:  post.title,
        created: new Date(post.created * 1000),
        created_at: post.created,
        html: sanitizedHtml(post.selftext_html)
    }
}
module.exports = {
    extractPageOfPost
}
