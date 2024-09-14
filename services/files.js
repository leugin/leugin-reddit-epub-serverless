const fs = require('node:fs');
const writeInLocal = (path, content)=> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(path)
            }
        })
    })
}

const  writeFile =  async  (content, path = 'storage/file.txt') => {
    return  process.env.IS_OFFLINE
        ? Promise.resolve()
        : writeInLocal(path, content)
}

module.exports = {
    writeFile
}
