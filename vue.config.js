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
  }
};
