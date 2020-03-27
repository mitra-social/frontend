import Vue from "vue";
import Vuex from "vuex";

import Auth from "@/store/modules/authentication";
import User from "@/store/modules/user";
import Posts from "@/store/modules/posts";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    User,
    Posts
  }
});
