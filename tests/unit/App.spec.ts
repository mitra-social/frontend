import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";
import "@/plugins/date-fns";
import router from "@/router";
import store from "@/store";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/App.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();
    await flushPromises();
  });

  it("App container exists", () => {
    const wrapper = mount(App, { localVue, router, store, vuetify });

    expect(wrapper.find(".app-container").exists()).toBe(true);
  });

  it("Dialog container exists", () => {
    const wrapper = mount(App, { localVue, router, store, vuetify });

    expect(wrapper.find(".v-dialog__container").exists()).toBe(true);
  });

  it("Snack  exists", () => {
    const wrapper = mount(App, { localVue, router, store, vuetify });

    expect(wrapper.find(".v-snack").exists()).toBe(true);
  });

  it("Header exists", () => {
    const wrapper = mount(App, { localVue, router, store, vuetify });

    expect(wrapper.find("header").exists()).toBe(true);
  });

  it("Main container exists", () => {
    const wrapper = mount(App, { localVue, router, store, vuetify });

    expect(wrapper.find("main").exists()).toBe(true);
  });
});
