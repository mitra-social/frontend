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

  beforeEach(async () => {
    const user = "john.doe";
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");

    store.dispatch("Following/fetchFollowing", "john.doe");
    await flushPromises();
  });

  afterEach(async () => {
    store.state.Following.following = [];
    await flushPromises();
  });

  it("Renders all following users as list items", async () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      vuetify,
      store,
    });

    await flushPromises();
    const listItems = wrapper.findAll(".follower-container .v-list-item");
    expect(listItems.length).toBe(3);
  });

  it("Toggle exclude all actors from posts", async () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      vuetify,
      store,
    });

    // created() state of excluded actors
    expect(wrapper.findAll(".mdi-eye").length).toBe(3);
    expect(wrapper.findAll(".mdi-eye-off").length).toBe(1);

    // exclude all actors
    let button = wrapper.find("#add-exclude-actor-btn");
    button.trigger("click");
    await flushPromises();

    expect(wrapper.vm.$store.state.Collection.excludedActors.length).toBe(2);
    expect(wrapper.findAll(".mdi-eye").length).toBe(1);
    expect(wrapper.findAll(".mdi-eye-off").length).toBe(3);

    // Remove exclude all actors
    button = wrapper.find("#remove-exclude-actor-btn");
    button.trigger("click");
    await flushPromises();

    expect(wrapper.vm.$store.state.Collection.excludedActors.length).toBe(0);
    expect(wrapper.findAll(".mdi-eye").length).toBe(3);
    expect(wrapper.findAll(".mdi-eye-off").length).toBe(1);
  });
});
