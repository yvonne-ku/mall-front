const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // 基本路径
  publicPath: "/",

  // 输出文件目录
  outputDir: "dist",

  // 静态资源目录，相对于 outputDir 用于存放 webpack 处理后的静态文件的地方
  assetsDir: "static",

  // 开发服务器配置
  devServer: {
    port: 9999, // 前端开发服务器的端口
    open: true, // 自动打开浏览器
    proxy: {
      // 不使用网关的配置（开发环境直接测试单个服务）
      "/api/customer-user/*": {
        target: "http://127.0.0.1:8002", // 目标后端服务器地址
        changeOrigin: true, // 伪装成是同源请求
      },
      "/api/home/*": {
        target: "http://127.0.0.1:8009", // 目标后端服务器地址
        changeOrigin: true, // 伪装成是同源请求
      },
    },
  },

  // CSS 相关配置
  css: {
    extract: process.env.NODE_ENV === "production", // 生产环境下从 JS 提取 CSS 到单独文件
    loaderOptions: {
      sass: {},
    },
  },

  // 关闭保存时的ESLint检查
  lintOnSave: false,

  // 将 ES6+ 语法转换为浏览器兼容的 ES5 语法。
  // 需要转译 Element UI，因为开启 Element UI 的按需加载后，部分组件使用了 ES6 语法。
  transpileDependencies: ["element-ui"],

  // webpack 配置
  chainWebpack: (config) => {
    // 路径别名设置
    config.resolve.alias
      .set("@", path.resolve(__dirname, "src"))
      .set("@components", path.resolve(__dirname, "src/components"))
      .set("@page", path.resolve(__dirname, "src/page"))
      .set("@common", path.resolve(__dirname, "src/common"))
      .set("@assets", path.resolve(__dirname, "src/assets"))
      .set("@api", path.resolve(__dirname, "src/api"))
      .set("@utils", path.resolve(__dirname, "src/utils"));

    // gzip 压缩
    if (process.env.NODE_ENV === "production") {
      if (process.env.VUE_APP_ENABLE_GZIP === "true") {
        config.plugin("compression").use(CompressionWebpackPlugin, [
          {
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|css)$/, // 压缩 js 和 css 文件
            threshold: 10240, // 只有大于 10KB 的文件才压缩
            minRatio: 0.8, // 压缩率小于 0.8 才压缩
            deleteOriginalAssets: false, // 不删除原始文件
          },
        ]);
      }
    }

    // 打包分析
    if (process.env.npm_config_report) {
      // npm_config_* 是 npm 的内置环境变量，可以通过命令行传递参数配置值，例如：npm run build --report
      config.plugin("webpack-bundle-analyzer").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "server",
          analyzerHost: "127.0.0.1",
          analyzerPort: 8888,
          openAnalyzer: true,
        },
      ]);
    }
  },
};
