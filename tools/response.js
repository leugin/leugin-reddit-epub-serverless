const ok = (message, data = {})=> {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
}
const unProcessable = (message, data = {})=> {
    return {
        statusCode: 412,
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
}
const error = (message, data = {})=> {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
}
module.exports = {
    ok,
    error,
    unProcessable
}
