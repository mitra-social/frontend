import Vue from "vue";

import vuetify from "@/plugins/vuetify";
import "@/plugins/date-fns";
import "@/plugins/global-directives";
import router from "@/router";
import store from "@/store";

import "@/registerServiceWorker";
import App from "@/App.vue";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
