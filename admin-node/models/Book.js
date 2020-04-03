const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utlis/constant')
const fs = require('fs')
const Epub = require('../utlis/epub')
const xml2js = require('xml2js').parseString
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
        this.originalName = originalname //文件原名


    }

    createBookFromDate(data) {

    }
    parse() {
        return new Promise((resolve, reject) => {
            const bookPath = `${UPLOAD_PATH}/${this.filePath}`
            if (!fs.existsSync(bookPath)) {
                reject(new Error('电子书不存在'))
            }
            const epub = new Epub(bookPath)
            epub.on('error', (err) => {
                reject(err)
            })
            epub.on('end', (err) => {
                if (err) {
                    reject(err)
                }
                console.log(epub.metadata, 'epub end')
                const {
                    language,
                    creator,
                    creatorFileAs,
                    title,
                    cover,
                    publisher
                } = epub.metadata
                if (!title) {
                    reject(new Error('图书标题为空'))
                } else {
                    this.title = title
                    this.language = language || 'en'
                    this.author = creator || creatorFileAs || 'unknow'
                    this.publisher = publisher || 'unknow'
                    this.rootFile = epub.rootFile
                    const handleGetImage = (err, file, mimeType) => {
                        console.log(err, file, mimeType)
                        if (err) {
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
                    try {
                        this.unzip()
                        this.parseContents(epub).then(({ chapters, chapterTree }) => {
                            this.contents = chapters
                            this.contentsTree = chapterTree
                            epub.getImage(cover, handleGetImage)
                        })
                    } catch (e) {
                        reject(e)
                    }

                }
            })
            epub.parse()
        })
    }
    unzip() {
        const AdmZip = require('adm-zip')
        const zip = new AdmZip(Book.genPath(this.path))
        zip.extractAllTo(Book.genPath(this.unzipPath), true) // 解压后的文件夹路径，参数2为true，代表进行覆盖
    }
    static genPath(path) {
        if (!path.startsWith('/')) {
            path = `/${path}`
        }
        return `${UPLOAD_PATH}${path}`
    }
    parseContents(epub) {
        function getNcxFilePath() {
            const spine = epub && epub.spine
            const manifest = epub && epub.manifest
            const ncx = spine.toc && spine.toc.href
            const id = spine.toc && spine.toc.id
            // console.log('spine00', spine.toc, ncx, manifest[id].href);
            if (ncx) {
                return ncx
            } else {
                return manifest[id].href
            }
        }
        const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`)
        // console.log('ncxFilePath00', ncxFilePath);

        const findParent = (array, level = 0, pid = '') => {
            return array.map(item => {
                item.level = level
                item.pid = pid
                if (item.navPoint && item.navPoint.length > 0) {
                    item.navPoint = findParent(item.navPoint, level + 1, item['$'].id)
                } else if (item.navPoint) {
                    item.navPoint.level = level + 1
                    item.navPoint.pid = item['$'].id
                }
                return item
            })
        }
        const flatten = (array) => {
            return [].concat(...array.map(item => {
                if (item.navPoint && item.navPoint.length > 0) {
                    return [].concat(item, ...flatten(item.navPoint))
                } else if (item.navPoint) {
                    return [].concat(item, item.navPoint)
                }
                return item
            }))
        }
        if (fs.existsSync(ncxFilePath)) {
            return new Promise((resolve, reject) => {
                const xml = fs.readFileSync(ncxFilePath, 'utf-8')
                const fileName = this.fileName
                xml2js(xml, {
                    explicitArray: false,
                    ignoreAttrs: false
                }, (err, json) => {
                    if (err) {
                        reject(err)
                    }
                    console.log('xml00', json);
                    const navMap = json.ncx.navMap
                    console.log('navMap00', JSON.stringify(navMap));
                    if (navMap.navPoint && navMap.navPoint.length > 0) {
                        navMap.navPoint = findParent(navMap.navPoint)
                        const newNavMap = flatten(navMap.navPoint)
                        // console.log(newNavMap === navMap.navPoint);
                        const chapters = []
                        console.log(epub.flow);
                        epub.flow.forEach((chapter, index) => {
                            if (index + 1 > newNavMap.length) {
                                return
                            }
                            const nav = newNavMap[index]
                            chapter.text = `${UPLOAD_URL}/unzip/${fileName}/${chapter.href}`
                            // console.log('chapter.text', chapter.text);
                            if (nav && nav.navLabel) {
                                chapter.label = nav.navLabel.text
                            } else {
                                chapter.label = ''
                            }
                            chapter.navId = nav['$'].id
                            chapter.fileName = fileName
                            chapter.order = index + 1
                            chapter.level = nav.level
                            chapter.pid = nav.pid
                            // console.log('chapter', chapter);

                            chapters.push(chapter)
                        })
                        const chapterTree = []
                        chapters.forEach(c => {
                            c.children = []
                            if (c.pid === '') {
                                chapterTree.push(c)
                            } else {
                                const parent = chapters.find(_ => _.navId === c.pid)
                                console.log(parent, 'parent');
                                parent.children.push(c)
                            }
                        })
                        console.log('chapters00', chapters);
                        console.log('chapterTree00', chapterTree);

                        resolve({ chapters, chapterTree })
                    } else {
                        reject(new Error('目录解析失败，目录数为0'))
                    }
                })
            })
        } else {
            throw new Error('目录文件不存在')
        }
    }
}

module.exports = Book;