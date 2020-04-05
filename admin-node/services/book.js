const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
const exists = (book) => {
    const { title, author, publisher } = book
    const sql = `SELECT * FROM book where title = '${title}' and author = '${author}' and publisher = '${publisher}'`
    return db.queryOne(sql)
    // return false
}
const removeBook = async (book) => {
    if (book) {
        book.reset()
        console.log(book, 'fileName33');
        if (book.filename) {
            const removeBookSql = `delete from book where fileName = '${book.filename}'`
            const removeContentSql = `delete from contents where fileName = '${book.filename}'`
            await db.queryOne(removeBookSql)
            await db.queryOne(removeContentSql)
        }
    }
}

const insertContents = async (book) => {
    const contents = book.getContents()
    console.log(contents, '423');
    if (contents && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            const content = contents[i]
            const _content = _.pick(content, [
                'fileName',
                'id',
                'href',
                'order',
                'level',
                'text',
                'label',
                'pid',
                'navId'
            ])
            console.log(_content, '_content');
            await db.insert(_content, 'contents')
        }
    }

}
const insertBook = (book) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                const isExist = await exists(book)
                if (isExist) {
                    await removeBook(book)
                    reject(new Error('电子书已存在'))
                } else {
                    console.log(book, 'book00');

                    await db.insert(book.toDb(), 'book')
                    await insertContents(book)
                    resolve()
                }
            } else {
                reject(new Error('添加的图书对象不合法！'))
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    insertBook
}