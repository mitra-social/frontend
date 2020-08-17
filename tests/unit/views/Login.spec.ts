import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import Login from "@/views/Login.vue";
import { User } from "@/model/user";
import * as userData from "@/api-client/mock/data/user.json";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Login.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const username = "john.doe";
  const password = "123";
  // eslint-disable-next-line
  const user = (userData as any) as User

  beforeEach(async () => {
    vuetify = new Vuetify();

    if (router.currentRoute.path !== "/login") {
      router.push({ name: "Login" });
    }

    store.state.User.user = user;
    await flushPromises();
  });

  afterEach(() => {
    store.state.User.user = undefined;
    store.state.Auth.status = 0;
    AuthenticationUtil.clear();
  });

  it("Login success", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.find('input[name="login"]').setValue(username);
    wrapper.find('input[name="password"]').setValue(password);
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(false);
    expect(router.currentRoute.path).toBe("/");
  });

  // it("Login wrong user", async () => {
  //   const wrapper = mount(Login, { localVue, vuetify, router, store });

  //   wrapper.find('input[name="login"]').setValue("foo.bar");
  //   wrapper.find('input[name="password"]').setValue(password);
  //   await flushPromises();

  //   wrapper.find("form").trigger("submit.prevent");
  //   await flushPromises();

  //   expect(wrapper.find(".v-alert").exists()).toBe(true);
  //   expect(router.currentRoute.path).toBe("/login");
  // });

  it("Login wrong password", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });

    wrapper.find('input[name="login"]').setValue(username);
    wrapper.find('input[name="password"]').setValue("123-4");
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(true);
    expect(router.currentRoute.path).toBe("/login");
  });

  it("Goto signup", async () => {
    const wrapper = mount(Login, { localVue, vuetify, router, store });
    const button = wrapper.find("#signup-link");
    button.trigger("click");
    await flushPromises();

    expect(router.currentRoute.path).toBe("/signup");
  });

  it("Login with 401 code", async () => {
    store.state.Auth.status = 401;
    router.currentRoute.params.redirectFrom = "/home";
    await flushPromises();

    const wrapper = mount(Login, { localVue, vuetify, router, store });
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(true);
    expect(router.currentRoute.path).toBe("/login");
  });
});
