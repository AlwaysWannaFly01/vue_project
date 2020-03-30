const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utlis/constant')
const fs = require('fs')
class Book {
    constructor(file, data) {
        if (file) {
            this.createBookFromFile(file)
        } else {
            this.createBookFromDate(data)
        }
    }

    createBookFromFile(file) {
        console.log('createBookFromFile', file)
        const {
            destination,
            mimetype = MIME_TYPE_EPUB,
            path,
            filename,
            originalname
        } = file
        // 后缀名
        const suffix = mimetype === MIME_TYPE_EPUB ? '.epub' : ''
        // 原有路径
        const oldBookPath = path
        // 新路径
        const bookPath = `${destination}/${filename}${suffix}`
        // 下载url
        const url = `${UPLOAD_URL}/book/${filename}${suffix}`
        // 解压后的文件夹路径
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
        // 解压后的文件夹url
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, { recursive: true })
        }
        if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath)
        }
        this.fileName = filename //文件名
        this.path = `/book/${filename}${suffix}`//epub文件相对路径
        this.filePath = this.path
        this.unzipPath = `/unzip/${filename}` //epub解压后的相对路径
        this.url = url //epub下载链接
        this.title = '' //书名
        this.author = ''//作者
        this.publisher = ''//出版社
        this.contents = [] //目录
        this.cover = ''
        this.category = -1
        this.categoryText = ''//分类名称
        this.language = ''
        this.unzipUrl = unzipUrl//解压后文件夹链接
        this.originalname = originalname //文件原名


    }

    createBookFromDate(data) {

    }

}

module.exports = Book;