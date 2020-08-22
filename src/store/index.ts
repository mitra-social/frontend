import Vue from "vue";
import Vuex from "vuex";

import Notify from "@/store/modules/notify";
import Dialog from "@/store/modules/dialog";
import DialogAttachments from "@/store/modules/dialog-attachments";
import Auth from "@/store/modules/authentication";
import User from "@/store/modules/user";
import Collection from "@/store/modules/collection";
import Following from "@/store/modules/following";
import Follower from "@/store/modules/follower";
import FindUser from "@/store/modules/find-user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Notify,
    Dialog,
    DialogAttachments,
    Auth,
    User,
    Collection,
    Following,
    Follower,
    FindUser,
  },
});
