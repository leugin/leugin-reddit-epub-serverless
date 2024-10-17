const {ok, error} = require("../tools/response");
const {save, paths, url, put} = require("../services/storage");
const epub = require('epub-gen-memory').default;

exports.handler = async (event) => {
    const content  = JSON.parse(event.body)
    const uuid = event.pathParameters.uid
    const options = {
        title: content.title,
        author: content.author,
        cover: content.cover,
        description: content.description,
        content: content.content.map((val)=> {
            return {
                title: val.title.substring(0, 50),
                author: val.author,
                content: val.content
            }
        })
    }

    try {

        const tempPath = paths.temp( uuid+ '.json')
        await put(JSON.stringify(options), tempPath )
        return ok("Completed", {
            url: url(tempPath),
            uuid,
        })

    }catch (e) {
        console.error( e)
        return  error("e", e | {})
    }




};
