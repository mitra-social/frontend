import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import FollowingActors from "@/views/home/FollowingActors.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/FollowingActors.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();
    const user = "john.doe";

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");

    store.dispatch("Following/fetchFollowing", user);
    await flushPromises();
  });

  afterEach(async () => {
    store.state.Following.following = [];
    await flushPromises();
  });

  it("Renders all following users as list items", () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      store,
      vuetify,
    });

    const listItems = wrapper.findAll(".follower-container .v-list-item");
    expect(listItems.length).toBe(6);
  });
});
