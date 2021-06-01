module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': [0, 'error', 'windows'], // 解决window缩进报错
    'react/prop-types': 0, // 防止在react组件定义中缺少props验证
    'react/jsx-props-no-spreading': 0, // {...props允许}
    'implicit-arrow-linebreak': 0, // 箭头函数返回值换行校验禁止
    'import/no-named-as-default': 0, // 允许export class xx 和 export default xxclass 共存
    'import/prefer-default-export': 0, // 允许没有default export
    'no-console': 0, // 允许console
    'react/static-property-placement': 0, // 允许static
    'max-len': [2, { code: 150 }], // 设置大长度150
    'max-classes-per-file': [1, 7], // 单个文件最大class
    'react/destructuring-assignment': 0, // 不强制解构
    'react/state-in-constructor': 0, // 不强制state位于constructor
    'react/no-array-index-key': 0, // 允许index作为key
    'import/no-unresolved': 0, // 消除不识别根目录
    'import/no-cycle': 0, // 允许../../
    'no-plusplus': 0, // 允许x++
    'no-param-reassign': 0, // 允许修改入参
    'no-shadow': 0,
    'no-nested-ternary': 0,
    'no-use-before-define': 0,
    'no-unused-expressions': 0,
    semi: [2, 'never'], // 不要分号
  },
}
