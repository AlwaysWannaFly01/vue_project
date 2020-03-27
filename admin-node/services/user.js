const { querySql, queryOne } = require('../db')

const login = (username, password) => {
    return querySql(`select * from admin_user where username ='${username}' and password ='${password}'`)
}
const findUser = (username) => {
    return queryOne(`select * from admin_user where username = '${username}'`)
}
module.exports = { login, findUser }