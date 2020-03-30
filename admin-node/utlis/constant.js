const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? '/Users/alwayswannafly/upload/admin-upload-ebook' : ''
const UPLOAD_URL = env === 'dev' ? 'https://awyadmin.xyz/admin-upload-ebook' : ''

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
    MIME_TYPE_EPUB: 'application/epub+zip'
}