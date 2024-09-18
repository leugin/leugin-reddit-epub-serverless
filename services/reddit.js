const querystring = require('querystring');

let token = null

const max = process.env.MAX_REQUEST

const credentials = ()=> {
    const credentials = {
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
    }
    return {
        ...credentials,
        auth: ()=> {
            return 'Basic ' + Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`)
                .toString('base64')
        },
    }
}
const login =   () => {
    const authorization = credentials()
     const URL = 'https://www.reddit.com/api/v1/access_token'

    const postData = querystring.stringify({
        grant_type: 'password',
        username: authorization.username,
        password: authorization.password
    });
    return  fetch(URL, {
        method: 'POST',
        headers: {
            'Authorization': authorization.auth(),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length,
            'User-Agent': 'MyAPI/0.0.1'
        },
        body: postData
    })
}

const checkAndGetAccessToken = async () => {
    if (token) {
        return Promise.resolve(token)
    } else {
        const response = await login()
        const json = await response.json()
        token = json.access_token
        return Promise.resolve(json.access_token)
    }
}

const find =   async (subReddit, criteria, options = {}) => {
    const token = await checkAndGetAccessToken()
    const BASE_URL = `https://oauth.reddit.com/r/${subReddit}/search?`
    const URL = BASE_URL + new URLSearchParams({
        ...options,
        q: criteria
    })
    return fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
}

const findAll =   async (subReddit, criteria, options = {}) => {

    const allResponses = [];

    let response = await find(subReddit, criteria, options)
    const text  = await response.text()
    let json = text ? JSON.parse(text) : {}
    let i = 0;
    while (json && json.data.children.length > 0 && json.data.after && i < max) {
        allResponses.push(...json.data.children)
        response = await find(subReddit, criteria, {
            ...options,
            after: json.data.after
        })
        const text  = await response.text()
        json = text ? JSON.parse(text) : null
        i++
    }
    return Promise.resolve(allResponses)
}

module.exports = {
    login,
    checkAndGetAccessToken,
    find,
    findAll
}
