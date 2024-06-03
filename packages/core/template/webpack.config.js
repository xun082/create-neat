import path from "path";

module.exports = {
  entry: "./src/index.js", //入口文件
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash:5].js",
  },
  plugins: [],
  module: {
    rules: [],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 开发服务器访问的路径
    compress: true, // 启用 gzip 压缩
    port: 9000, // 端口号
  },
};
