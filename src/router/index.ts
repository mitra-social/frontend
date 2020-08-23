import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import Home from "@/views/home/index.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login" },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
    meta: { title: "SignUp" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/signup"];
  const authRequired = !publicPages.includes(to.path);
  const isAuthenticated = !!AuthenticationUtil.getToken();

  if (!authRequired && isAuthenticated) {
    next({ name: "Home" });
  } else if (authRequired && !isAuthenticated) {
    next({ name: "Login" });
  } else if (authRequired && !store.getters["User/isUserFetch"]) {
    store
      .dispatch("User/fetchUser", AuthenticationUtil.getUser())
      .then(() => {
        next();
      })
      .catch(() => {
        AuthenticationUtil.clear();
        next({ name: "Login", params: { redirectFrom: to.fullPath } });
      });
  } else {
    next();
  }
});

export default router;
