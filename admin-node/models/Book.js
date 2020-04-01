const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utlis/constant')
const fs = require('fs')
const Epub = require('../utlis/epub')
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
        this.cover = ''//封面图片url
        this.coverPath = ''//封面图片路径
        this.category = -1
        this.categoryText = ''//分类名称
        this.language = ''
        this.unzipUrl = unzipUrl//解压后文件夹链接
        this.originalname = originalname //文件原名


    }

    createBookFromDate(data) {

    }
    parse(){
        return new Promise((resolve,reject)=>{
            const bookPath = `${UPLOAD_PATH}/${this.filePath}`
            if(!fs.existsSync(bookPath)){
                reject(new Error('电子书不存在'))
            }
            const epub = new Epub(bookPath)
            epub.on('error', (err)=>{
                reject(err)
            })
            epub.on('end', (err)=>{
                if(err){
                    reject(err)
                }
                console.log(epub.metadata ,'epub end')
                const {
                    language,
                    creator,
                    creatorFileAs,
                    title,
                    cover,
                    publisher
                } = epub.metadata
                if(!title){
                    reject(new Error('图书标题为空'))
                }else{
                    this.title = title
                    this.language = language || 'en'
                    this.author = creator || creatorFileAs|| 'unknow'
                    this.publisher = publisher || 'unknow'
                    this.rootFile = epub.rootFile

                    const handleGetImage = (err,file,mimeType ) => {
                        console.log(err, file, mimeType)
                        if(err){
                            reject(err)
                        }
                        const suffix = mimeType.split('/')[1]
                        const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                        const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`

                        fs.writeFileSync(coverPath, file, 'binary')
                        this.coverPath = `/img/${this.fileName}.${suffix}`
                        this.cover = coverUrl
                        resolve(this)
                    }
                    epub.getImage(cover, handleGetImage)
                }
            })
            epub.parse()
        })
    }
}

module.exports = Book;