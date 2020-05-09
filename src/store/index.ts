import Vue from "vue";
import Vuex from "vuex";

import Auth from "@/store/modules/authentication";
import User from "@/store/modules/user";
import Collection from "@/store/modules/collection";
import Following from "@/store/modules/following";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    User,
    Collection,
    Following
  }
});
