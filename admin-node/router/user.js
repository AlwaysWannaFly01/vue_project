const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { md5 } = require('../utlis')
const { PWD_SALT } = require('../utlis/constant')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utlis/constant')
const router = express.Router()

router.post(
    '/login',
    [
        body('username').isString().withMessage('用户名必须为字符'),
        body('password').isString().withMessage('密码必须为字符')
    ],
    function (req, res, next) {
        const err = validationResult(req)
        console.log(err);
        if (!err.isEmpty()) {
            const [{ msg }] = err.errors
            next(boom.badRequest(msg))
        } else {
            let { username, password } = req.body
            password = md5(`${password}${PWD_SALT}`)
            login(username, password).then(user => {
                if (!user || user.length === 0) {
                    new Result('登录失败').fail(res)
                } else {
                    console.log(user, 'user');
                    // const [_user] = user
                    const token = jwt.sign(
                        { username },
                        PRIVATE_KEY,
                        { expiresIn: JWT_EXPIRED }
                    )
                    new Result({ token }, '登录成功').success(res)
                }
            })
        }
    })
router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router