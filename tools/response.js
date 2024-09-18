const ok = (message, data = {})=> {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
}
const unProcessable = (message, data = {})=> {
    return {
        statusCode: 422,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
}
const error = (message, data = {})=> {
    return {
        statusCode: 400,
        headers: {
            'Content-Type': 'application/json'
        },
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
