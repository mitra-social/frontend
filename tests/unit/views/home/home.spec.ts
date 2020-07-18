import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import Home from "@/views/home/index.vue";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("views/home/index.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();

    store.state.User.user = {
      userId: "id",
      email: "test@mail.ch",
      registeredAt: new Date(),
      preferredUsername: "john.doe",
      icon: "icon.jpg",
      inbox: "https://social.example/john.doe/inbox/",
    };

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    await flushPromises();
  });

  afterEach(async () => {
    AuthenticationUtil.clear();
    await flushPromises();
  });

  it("User is set and has a name", () => {
    const wrapper = shallowMount(Home, { localVue, vuetify, store });
    expect(wrapper.find("#user-name").text()).toBe("john.doe");
  });

  it("User is set and has a name", () => {
    const wrapper = shallowMount(Home, { localVue, vuetify, store });
    expect(wrapper.find("#user-email").text()).toBe("test@mail.ch");
  });

  it("User is set and has an avater", () => {
    const wrapper = shallowMount(Home, { localVue, vuetify, store });
    expect(wrapper.find("#user-icon").exists()).toBe(true);
  });
});
