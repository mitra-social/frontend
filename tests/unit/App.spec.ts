import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";
import "@/plugins/date-fns";
import store from "@/store";
import router from "@/router";
import { AuthenticationUtil } from "@/utils/authentication-util";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/App.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();

    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: () => null,
    });

    await flushPromises();
  });

  it("App container exists", () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    expect(wrapper.find(".app-container").exists()).toBe(true);
  });

  it("Dialog container exists", async () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    await flushPromises();
    expect(wrapper.find(".v-dialog__container").exists()).toBe(true);
  });

  it("Snack  exists", () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    expect(wrapper.find(".v-snack").exists()).toBe(true);
  });

  it("Header exists", () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    expect(wrapper.find("header").exists()).toBe(true);
  });

  it("Main container exists", () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    expect(wrapper.find("main").exists()).toBe(true);
  });
});
