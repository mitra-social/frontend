import Vue from "vue";
import Vuex from "vuex";

import Auth from "@/store/modules/authentication";
import Collection from "@/store/modules/collection";
import Dialog from "@/store/modules/dialog";
import DialogAttachments from "@/store/modules/dialog-attachments";
import FindUser from "@/store/modules/find-user";
import Follower from "@/store/modules/follower";
import Following from "@/store/modules/following";
import Notify from "@/store/modules/notify";
import User from "@/store/modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    Collection,
    Dialog,
    DialogAttachments,
    Follower,
    Following,
    FindUser,
    Notify,
    User,
  },
});
