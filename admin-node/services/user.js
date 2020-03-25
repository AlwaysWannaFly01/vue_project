const { querySql } = require('../db')

const login = (username, password) => {
    return querySql(`select * from admin_user where username ='${username}' and password ='${password}'`)
        .then(result => {
            console.log('查询成功000');
        }).catch(err => {
            console.log('查询失败000');
        })
}
module.exports = { login }