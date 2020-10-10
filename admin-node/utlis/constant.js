const { env } = require('./env')
// const UPLOAD_PATH = env === 'dev' ? '/Users/alwayswannafly/upload/admin-upload-ebook' : ''


/*公司台式机*/
const UPLOAD_PATH = env === 'dev' ? 'G:\\AwyNginxConfig\\AlwaysWannaFly\\upload\\admin-upload-ebook' : ''

/* 在家里windows电脑使用该地址 */
// const UPLOAD_PATH = env === 'dev' ? 'E:/AwyNginxConfig/AlwaysWannaFly/upload/admin-upload-ebook' : ''
const UPLOAD_URL = env === 'dev' ? 'https://awyadmin.xyz/admin-upload-ebook' : 'https://www.awyadmin.xyz/admin-upload-ebook'

const OLD_UPLOAD_URL = env === 'dev' ? 'https://awyadmin.xyz/book/res/img' : 'https://www.awyadmin.xyz/book/res/img'
module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug: true,
    PWD_SALT: 'admin_imooc_node',
    PRIVATE_KEY: 'alwayswannafly',
    JWT_EXPIRED: 60 * 60,
    UPLOAD_PATH,
    UPLOAD_URL,
    OLD_UPLOAD_URL,
    MIME_TYPE_EPUB: 'application/epub+zip'
}