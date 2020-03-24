const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    console.log(req.body); 
    
    res.json({
        code: 0,
        msg: '登录成功'
    })
})
router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router