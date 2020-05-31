import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";
import Home from "@/views/home/index.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";

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
    name: "login",
    component: Login,
    meta: { title: "Login" },
  },
  {
    path: "/signup",
    name: "signup",
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

  if (authRequired && !store.getters["Auth/isAuthenticated"]) {
    next({ name: "login" });
  } else if (authRequired && !store.getters["User/isUserFetch"]) {
    store
      .dispatch("User/fetchUser", AuthenticationUtil.getUser())
      .then(() => {
        next();
      })
      .catch(() => {
        next({ name: "login", params: { redirectFrom: to.fullPath } });
      });
  } else {
    next();
  }
});

export default router;
