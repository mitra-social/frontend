import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import Login from "@/views/Login.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Login.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();

    if (router.currentRoute.path !== "/login") {
      router.push({ name: "Login" });
    }
  });

  it("Login success", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.setData({
      user: "johnny.doe@mail.ch",
      password: "123",
    });

    const button = wrapper.find("#login-btn");
    button.trigger("click");
    flushPromises().then(() => {
      expect(wrapper.find(".v-alert").exists()).toBe(false);
      expect(router.currentRoute.path).toBe("/");
    });
  });

  it("Login failed", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.setData({
      user: "foo@bar.ch",
      password: "123",
    });

    flushPromises().then(async () => {
      const button = wrapper.find("#login-btn");
      button.trigger("click");

      expect(wrapper.find(".v-alert").exists()).toBe(true);
      expect(router.currentRoute.path).toBe("/login");
    });
  });

  it("Goto signup", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });
    const button = wrapper.find("#signup-link");
    button.trigger("click");

    flushPromises().then(async () => {
      expect(router.currentRoute.path).toBe("/signup");
    });
  });
});
