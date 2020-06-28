import Vue from "vue";
import Vuex from "vuex";

import Notify from "@/store/modules/notify";
import Dialog from "@/store/modules/dialog";
import Auth from "@/store/modules/authentication";
import User from "@/store/modules/user";
import Collection from "@/store/modules/collection";
import Following from "@/store/modules/following";
import Follower from "@/store/modules/follower";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Notify,
    Dialog,
    Auth,
    User,
    Collection,
    Following,
    Follower
  },
});
