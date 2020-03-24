const express = require('express')
const Result = require('../models/Result')
const router = express.Router()

router.post('/login', function (req, res) {
    // console.log(req.body);
    // console.log(res, 'res');
    const { username, password } = req.body
    console.log(username);
    console.log(password);
    if (username === 'admin' && password === '111111') {
        new Result('登录成功').success(res)
    }else{
        new Result('登录失败').fail(res)
    }
})
router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router