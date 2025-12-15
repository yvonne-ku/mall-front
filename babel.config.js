module.exports = {
  presets: [
    [
        '@vue/cli-plugin-babel/preset',
        {
          targets: {
            browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
          }
        }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    // Element UI 按需加载配置
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-default"
      }
    ]
  ]
}
