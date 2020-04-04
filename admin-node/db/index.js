const mysql = require('mysql')
const config = require('./config')
const { debug } = require('../utlis/constant')
const { isObject } = require('../utlis')
const connect = () => {
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        multipleStatements: true
    })
}
function querySql(sql) {
    const conn = connect()
    debug && console.log(sql)
    return new Promise((resolve, reject) => {
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log('查询失败，原因:' + JSON.stringify(err))
                    reject(err)
                } else {
                    debug && console.log('查询成功', JSON.stringify(results))
                    resolve(results)
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end()
        }
    })
}
const queryOne = (sql) => {
    return new Promise((resolve, reject) => {
        querySql(sql).then(results => {
            if (results && results.length > 0) {
                resolve(results[0])
            } else {
                resolve(null)
            }
        }).catch(err => {
            reject(err)
        })
    })
}
const insert = (model, tablename) => {
    return new Promise((resolve, reject) => {
        console.log(model, 'model00');
        if (!isObject(model)) {
            reject(new Error('插入数据库失败，插入数据非对象'))
        }
        const keys = []
        const values = []
        Object.keys(model).forEach((key) => {
            if (model.hasOwnProperty(key)) {
                keys.push(`\`${key}\``)
                values.push(`'${model[key]}'`)
            }
        })
        if (keys.length > 0 && values.length > 0) {
            let sql = `INSERT INTO \`${tablename}\`(`
            const keysString = keys.join(',')
            const valuesString = values.join(',')
            sql = `${sql}${keysString}) Values (${valuesString})`
            // debug && console.log('插入语句', sql)
            console.log(sql, 'sql语句');
            const conn = connect()
            try {
                conn.query(sql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (e) {
                reject(e)
            }
        } else {
            reject(new Error('插入数据库失败，对象中没有任何属性！'))
        }
    })

}
module.exports = {
    connect,
    querySql,
    queryOne,
    insert
}