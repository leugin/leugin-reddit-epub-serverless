 const {put, paths, url} = require("../services/storage");
const crypto = require("crypto");
const {extractPageOfPost} = require("../tools/reddit_tools");
const {ok, unProcessable, error} = require("../tools/response");
const {findAll} = require("../services/reddit");

exports.handler = async (event) => {
    const queryParams =  event.queryStringParameters;
    if (!queryParams || !queryParams.sub_reddit || !queryParams.search){
        return unProcessable("Please check the form")
    }
    const body = await findAll(
            queryParams.sub_reddit,
            queryParams.search
        )
    try {
        const clearedPost = [];
        body.forEach((item, index)=> {
            const p = extractPageOfPost(item.data)
            p.id = index
            clearedPost.push(p)
        })
        clearedPost.sort((a, b)=> {
            return b.created - a.created
        })

        const tempEpub =  {
            name: clearedPost.length > 0 ? clearedPost[0].name: queryParams.search,
            author: clearedPost.length > 0 ? clearedPost[0].author: queryParams.sub_reddit,
            pages: clearedPost
        }
        const uuid = crypto.randomUUID()
        const path = paths.temp( uuid+ '.json')
        await put(JSON.stringify(tempEpub), path )
        return ok("Completed", {
            url: url(uuid),
            uuid

        })

    }
    catch(e){
        console.error(e)
        return  error("Someting happends", e)
    }

};
