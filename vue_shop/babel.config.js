//项目发布阶段要用到的babel插件
const prodPlugins = []
//发布模式
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //发布产品时候的插件数组
    //这里的三个点，表示展开运算符，表示把prodPlugins数组中的每一项都展开放在这
    ...prodPlugins
  ]
}
