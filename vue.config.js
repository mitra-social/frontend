module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map",
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
    proxy: process.env.VUE_APP_BACKEND_HOST,
  },
};
