import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";
import Home from "@/views/home/index.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";

import Settings from "@/views/settings/index.vue";
import Profile from "@/views/settings/Profile.vue";
import Password from "@/views/settings/Password.vue";
import Preferences from "@/views/settings/Preferences.vue";
import FollowerFollowing from "@/views/settings/Follower-Following.vue";
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
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    children: [
      {
        path: "profile",
        name: "settings.profile",
        component: Profile,
        meta: { title: "Profile" },
      },
      {
        path: "password",
        name: "settings.password",
        component: Password,
        meta: { title: "Password" },
      },
      {
        path: "preferences",
        name: "settings.preferences",
        component: Preferences,
        meta: { title: "Preferences" },
      },
      {
        path: "follower-and-following",
        name: "settings.followerFollowing",
        component: FollowerFollowing,
        meta: { title: "Follower And Following" },
      },
    ],
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
