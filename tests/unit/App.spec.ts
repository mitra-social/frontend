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

describe("@/views/settings/Password.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();

    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: () => null,
    });
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    await flushPromises();
  });

  it("App container exists", async () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    expect(wrapper.find(".app-container").exists()).toBe(true);
  });

  it("Dialog container exists", async (done) => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    await flushPromises();
    expect(wrapper.find(".v-dialog__container").exists()).toBe(true);
    done();
  });

  it("Snack  exists", async (done) => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    await flushPromises();
    expect(wrapper.find(".v-snack").exists()).toBe(true);
    done();
  });

  it("Header exists", async (done) => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    await flushPromises();
    expect(wrapper.find("header").exists()).toBe(true);
    done();
  });

  it("Main container exists", async () => {
    const wrapper = mount(App, { localVue, vuetify, router, store });
    await flushPromises();
    expect(wrapper.find("main").exists()).toBe(true);
  });
});
