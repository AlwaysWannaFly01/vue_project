const express = require('express')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/', router)
// function myLogger(req, res, next) {
//     console.log('myLogger');
//     /* 使用中间件，next方法一定要调用，否则不会继续向下执行 */
//     /* 中间件需要在响应结束前被调用 */
//     next()
// }
// app.use(myLogger)

// app.get('/', (req, res) => {
//     // throw new Error('error')
//     res.send('hello node')
// })

// const errorHandler = (err, req, res, next) => {
//     /* 四个参数一个都不能少 */
//     /* 异常处理需要后置 */
//     console.log('errorHandler');
//     res.status(400).json({
//         error: -1,
//         msg: err.toString()
//     })
//     res.send('down...')
// }
// app.use(errorHandler)

// app.post('/user', (req, res) => {
//     res.send('hello node2')
// })
const privateKey = fs.readFileSync('./https/book_awyadmin.xyz.key');
const pem = fs.readFileSync('./https/book_awyadmin.xyz.pem')
const credentials = {
    key: privateKey,
    cert: pem
}
const httpsServer = https.createServer(credentials, app)
const SSlPORT = 18082

const server = app.listen(1224, () => {
    const { address, port } = server.address()
    console.log('HTTP启动成功-http://%s:%s', address, port);
}) 
httpsServer.listen(SSlPORT, ()=>{
    console.log('HTTPS启动成功-https://localhost:%s', SSlPORT);
})