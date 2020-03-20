const express = require('express')
const router = express.Router()

router.get('/info', (req, res, err) => {
    res.json('userinfo...')
})
module.exports = router