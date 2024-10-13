 const {get, paths} = require("../services/storage");
const {ok, error} = require("../tools/response");

exports.handler = async (event) => {
    try {
        const path = paths.temp(event.pathParameters.uid )+ '.json'
       const  res =  await get(path);
        return  ok('response', JSON.parse(res));
    }
    catch(e){
        return  error("Someting happends", e)
    }

};
