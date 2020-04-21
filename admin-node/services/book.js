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
            await db.querySql(removeBookSql)
            await db.querySql(removeContentSql)
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
            // console.log(_content, '_content');
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

const getBook = (fileName) => {
    return new Promise(async (resolve, reject) => {
        const bookSql = `select * from book where fileName = '${fileName}'`
        const contentSql = `select * from contents where fileName = '${fileName}' order by \`order\``
        const book = await db.queryOne(bookSql)
        const contents = await db.querySql(contentSql)
        if (book) {
            book.cover = Book.genCoverUrl(book)
            book.contentsTree = Book.genContentsTree(contents)
            console.log('查询book', book);
            resolve(book)
        } else {
            reject(new Error('电子书不存在'))
        }

    })
}

const updateBook = (book) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                // console.log('book5', book);
                const result = await getBook(book.filename)
                console.log('result2', result);
                if (result) {
                    const model = book.toDb()
                    if (+result.updateType === 0) {
                        reject(new Error('内置图书不能编辑'))
                    } else {
                        await db.update(model, 'book', `where fileName = '${book.filename}'`)
                        resolve()
                    }
                }
            } else {
                reject(new Error('添加的图书对象不合法'))
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getCategory = async () => {
    const sql = `select * from category order by category asc`
    const result = await db.querySql(sql)
    const categoryList = []
    result.forEach(item => {
        categoryList.push({
            label: item.categoryText,
            value: item.category,
            num: item.num
        })
    })
    return categoryList
}
module.exports = {
    insertBook,
    getBook,
    updateBook,
    getCategory
}