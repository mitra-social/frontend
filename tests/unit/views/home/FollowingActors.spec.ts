import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import FollowingActors from "@/views/home/FollowingActors.vue";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActors.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    const user = "john.doe";
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");

    store.dispatch("Following/fetchFollowing", "john.doe");
  });

  it("renders all following users as list items", async () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      vuetify,
      store,
    });

    await flushPromises();
    const listItems = wrapper.findAll(".follower-container .v-list-item");
    expect(listItems.length).toBe(3);
  });
});
