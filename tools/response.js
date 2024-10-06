const ok = (message, data = {})=> {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
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
