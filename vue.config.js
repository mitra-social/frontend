module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    resolve: {
      alias: {
        apiClient: require("path").resolve(
          __dirname,
          "src/api-client/" + process.env.VUE_APP_API_CLIENT
        ),
      },
    },
  },
  devServer: {
    proxy: process.env.VUE_APP_BACKEND_URL,
  },
};
