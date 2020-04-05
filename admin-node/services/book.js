const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
const exists = (book) => {
    return false
}
const removeBook = (book) => {

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