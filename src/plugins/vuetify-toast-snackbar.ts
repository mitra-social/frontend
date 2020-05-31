import Vue from "vue";
import VuetifyToast from "vuetify-toast-snackbar";

Vue.use(VuetifyToast, {
  timeout: 300000,
  multiLine: true,
  showClose: true,
  closeIcon: "mdi-close",
  property: "$toast",
});

Vue.prototype.$toast;
