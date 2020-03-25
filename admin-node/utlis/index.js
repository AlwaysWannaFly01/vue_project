const crypto = require('crypto')

const md5 = (s) => {
    return crypto.createHash('md5')
        .update(String(s)).digest('hex')
}

module.exports = {
    md5
}