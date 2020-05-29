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
  });
  it("Login success", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.setData({
      user: "johnny.doe@mail.ch",
      password: "123"
    });

    const button = wrapper.find(".v-btn");
    button.trigger("click");
    flushPromises().then(() => {
      expect(wrapper.find(".v-alert").exists()).toBe(false);
    });
  });

  it("Login failed", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.setData({
      user: "foo@bar.ch",
      password: "123"
    });

    flushPromises().then(async () => {
      const button = wrapper.find(".v-btn");
      button.trigger("click");

      expect(wrapper.find(".v-alert").exists()).toBe(true);
    });
  });
});
