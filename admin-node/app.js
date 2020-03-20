const express = require('express')
const app = express()

// function myLogger(req, res, next) {
//     console.log('myLogger');
//     /* 使用中间件，next方法一定要调用，否则不会继续向下执行 */
//     /* 中间件需要在响应结束前被调用 */
//     next()
// }
// app.use(myLogger)

app.get('/', (req, res) => {
    throw new Error('error')
    res.send('hello node')
})

const errorHandler = (err, req, res, next) => {
    /* 四个参数一个都不能少 */
    /* 异常处理需要后置 */
    console.log('errorHandler');
    res.status(400).json({
        error: -1,
        msg: err.toString()
    })
    res.send('down...')
}
app.use(errorHandler)

// app.post('/user', (req, res) => {
//     res.send('hello node2')
// })

const server = app.listen(1224, () => {
    const { address, port } = server.address()
    console.log('HTTP启动成功-http://%s:%s', address, port);
})