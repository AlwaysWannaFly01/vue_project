const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { md5 } = require('../utlis')
const { PWD_SALT } = require('../utlis/constant')
const router = express.Router()

router.post('/login', function (req, res) {
    let { username, password } = req.body
    password = md5(`${password}${PWD_SALT}`)

    login(username, password).then(user => {
        if (!user || user.length === 0) {
            new Result('登录失败').fail(res)
        } else {
            new Result('登录成功').success(res)
        }
    })
})
router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router