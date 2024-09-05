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

module.exports = {

    sanitizedHtml
}
