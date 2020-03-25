const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { md5 } = require('../utlis')
const { PWD_SALT } = require('../utlis/constant')
const router = express.Router()

router.post('/login', function (req, res) {
    // console.log(req.body);
    // console.log(res, 'res');
    let { username, password } = req.body
    // password = md5(`${password}${PWD_SALT}`)
    // login(username, password).then(user => {
    //     console.log(user,'user');
    //     if (!user || user.length === 0) {
    //         new Result('登录失败').fail(res)
    //     } else {
    //         console.log(444);
            
    //         new Result('登录成功').success(res)
    //     }
    // })
    login(username, password).then(user => {
        console.log(user);
        if (!user || user.length === 0) {
          new Result('登录失败').fail(res)
        } else {
          new Result('登录成功').success(res)
        }
      })
    // if (username === 'admin' && password === '111111') {
    //     new Result('登录成功').success(res)
    // } else {
    //     new Result('登录失败').fail(res)
    // }
})
router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router