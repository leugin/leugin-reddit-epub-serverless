const { decode } = require('entities');
const cheerio = require('cheerio');


const sanitizedHtml  = (ori) => {
    const decodedText = decode(ori
        .replace(/class="md"/g, '')
        .replaceAll(/\n/g, '')
    );
    const html = cheerio.load(decodedText)
    html('a').remove()
    return html('html').html()
}

const extractPageOfPost = (post) => {

    return {
        title:  post.title,
        author:  post.author,
        created: new Date(post.created * 1000),
        created_at: post.created,
        html: sanitizedHtml(post.selftext_html ?? '')
    }
}
module.exports = {
    extractPageOfPost
}
