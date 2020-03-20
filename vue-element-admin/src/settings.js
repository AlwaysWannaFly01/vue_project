module.exports = {
  title: '小慕读书',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  /* 控制设置按钮显示 */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  /* 顶部tab标签 */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  /* 头部置顶 */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  /* 左侧Logo */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
