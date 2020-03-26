const jwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utlis/constant')

module.exports = jwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true
}).unless({
    path: [
        '/',
        '/user/login'
    ]
})