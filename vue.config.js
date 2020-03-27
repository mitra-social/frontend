module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    resolve: {
      alias: {
        apiClient: require("path").resolve(
          __dirname,
          "src/api/" + process.env.VUE_APP_API_CLIENT
        )
      }
    }
  },
  devServer: {
    proxy: "http://mitra-backend:1337"
  }
};
