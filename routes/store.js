const {ok, error} = require("../tools/response");
const {save, paths} = require("../services/storage");
const epub = require('epub-gen-memory').default;

exports.handler = async (event) => {
    const content  = JSON.parse(event.body)
    const {uid} = event.pathParameters

    const options = {
        title: content.title || content.name || 'Title',
        author: content.author,
        content: content.pages.map((val)=> {
            return {
                title: val.title.substring(0, 50),
                author: val.author,
                content: val.html
            }
        })
    }


    try {
        // create epub
        const fileName =  uid + '.epub'
        const epu = await  epub({
            title: options.title,
            author: options.author,
        }, options.content);
        await save(epu, paths.books(fileName))
        return ok("resul", options)

    }catch (e) {
        console.error( e | {})
        return  ok("e", e | {})
    }




};
