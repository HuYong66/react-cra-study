const {
  override, fixBabelImports, addLessLoader, addDecoratorsLegacy, addWebpackAlias,
} = require('customize-cra')
const path = require('path')

module.exports = override(
  fixBabelImports('import', {
    // antd按需加载
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': 'red' },
  }),
  addDecoratorsLegacy(), // 装饰器
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'), // 没生效，不知道为什么
  }),
)
