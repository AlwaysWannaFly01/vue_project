const jwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utlis/constant')

module.exports = jwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true
}).unless({
    /* 配置白名单 */
    path: [
        '/',
        '/user/login'
    ]
})