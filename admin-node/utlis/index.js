const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../utlis/constant')

const md5 = (s) => {
    return crypto.createHash('md5')
        .update(String(s)).digest('hex')
}
const decoded = (req) => {
    let token = req.get('Authorization')
    console.log(token, 'token000');
    if (token.indexOf('Bearer') === 0) {
        token = token.replace('Bearer ', '')
    }
    console.log(token, 'token111');
    return jwt.verify(token, PRIVATE_KEY)
}
/* 判断是否为一个对象 */
const isObject = (o) => {
    // console.log(o, 'o');
    // console.log(Object.prototype.toString.call(o) === '[object Object]');
    return Object.prototype.toString.call(o) === '[object Object]'
}
module.exports = {
    md5,
    decoded,
    isObject
}