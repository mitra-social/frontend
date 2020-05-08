import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import FollowingActors from "@/views/home/FollowingActors.vue";
import store from "@/store";
import {AuthenticationUtil} from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActors.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    const user = "john.doe";
    vuetify = new Vuetify();

    AuthenticationUtil.setUser(user);
    AuthenticationUtil.setToken(
        "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );
    store.dispatch("Following/fetchFollowing", "john.doe");
  });

  it("renders all following users as list items", () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      vuetify,
      store
    });

    const listItems = wrapper.findAll(".follower-container .v-list-item");
    expect(listItems.length).toBe(2);
  });
});
