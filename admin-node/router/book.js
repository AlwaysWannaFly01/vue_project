const express = require('express')
const multer = require('multer')

const Result = require('../models/Result')
const Book = require('../models/Book')
const { UPLOAD_PATH } = require('../utlis/constant')
const { decoded } = require('../utlis')
const { insertBook } = require('../services/book')
const boom = require('boom')
const router = express.Router()
router.post(
    '/upload',
    multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
    (req, res, next) => {
        if (!req.file || req.file.length === 0) {
            new Result('上传电子书失败').fail(res)
        } else {
            const book = new Book(req.file)
            // console.log(book)
            book.parse()
                .then(book => {
                    // console.log(book, 'book-upload-success')
                    new Result(book, '上传电子书成功').success(res)
                }
                ).catch(err => {
                    console.log('upload-err', err)
                    next(boom.badImplementation(err))
                })
        }
    })
router.post('/create', (req, res, next) => {
    const decode = decoded(req)
    console.log(decode);
    console.log(req.body);
    if (decode && decode.username) {
        req.body.username = decode.username
    }
    const book = new Book(null, req.body)
    // console.log(book, 'book99');
    // const book = {}
    insertBook(book).then(() => {
        new Result('添加电子书成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})
module.exports = router
