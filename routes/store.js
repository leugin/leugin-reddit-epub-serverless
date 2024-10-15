const {ok, error} = require("../tools/response");
const {save, paths, url} = require("../services/storage");
const epub = require('epub-gen-memory').default;

const getName = (options) => {
    const date = new Date()
    date.getDay()
    // create epub
    const title =  options.title
        .replaceAll(' ', '_')
        .toLowerCase()
    return date.getDay().toString()
        + date.getMonth().toString()
        + date.getFullYear().toString()
        + date.getHours().toString()
        + date.getMinutes().toString()
        + date.getSeconds().toString()
        + date.getMilliseconds().toString()
        + title + '.epub';
}
exports.handler = async (event) => {
    const content  = JSON.parse(event.body)
    const options = {
        title: content.title,
        author: content.author,
        content: content.content.map((val)=> {
            return {
                title: val.title.substring(0, 50),
                author: val.author,
                content: val.html
            }
        })
    }

    try {
        const epu = await  epub({
            title: options.title,
            author: options.author,
        }, options.content);
        const path =  paths.books(getName(options))

        await save(epu, path)
        return ok("resul", {
            url : url(path)
        })

    }catch (e) {
        console.error( e | {})
        return  error("e", e | {})
    }




};
