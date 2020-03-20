const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('hello node')
})
const server = app.listen(1224, () => {
    const { address, port } = server.address()
    console.log('HTTP启动成功-http://%s:%s', address, port);

})