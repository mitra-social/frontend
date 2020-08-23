import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import * as userData from "@/api-client/mock/data/user.json";
import { InternalActor } from "@/model/internal-actor";
import router from "@/router";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import Login from "@/views/Login.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/Login.vue", () => {
  const password = "123";
  const username = "john.doe";
  // eslint-disable-next-line
  const user = (userData as any) as InternalActor
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();

    if (router.currentRoute.path !== "/login") {
      router.push({ name: "Login" });
    }

    await flushPromises();
  });

  afterEach(() => {
    store.state.User.user = undefined;
    store.state.Auth.status = 0;
    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(undefined);
  });

  it("Login success", async () => {
    const wrapper = mount(Login, { localVue, router, store, vuetify });

    wrapper.find('input[name="login"]').setValue(username);
    wrapper.find('input[name="password"]').setValue(password);
    await flushPromises();

    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    store.state.User.user = user;

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(false);
    expect(router.currentRoute.path).toBe("/");
  });

  it("Login wrong user", async () => {
    const wrapper = mount(Login, { localVue, router, store, vuetify });

    wrapper.find('input[name="login"]').setValue("foo.bar");
    wrapper.find('input[name="password"]').setValue(password);
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(true);
    expect(router.currentRoute.path).toBe("/login");
  });

  it("Login wrong password", async () => {
    const wrapper = mount(Login, { localVue, router, store, vuetify });

    wrapper.find('input[name="login"]').setValue(username);
    wrapper.find('input[name="password"]').setValue("123-4");
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.find(".v-alert").exists()).toBe(true);
    expect(router.currentRoute.path).toBe("/login");
  });

  it("Goto signup", async () => {
    const wrapper = mount(Login, { localVue, router, store, vuetify });

    const button = wrapper.find("#signup-link");
    button.trigger("click");
    await flushPromises();

    expect(router.currentRoute.path).toBe("/signup");
  });

  it("Login with 401 code", async () => {
    store.state.Auth.status = 401;
    router.currentRoute.params.redirectFrom = "/home";
    await flushPromises();

    const wrapper = mount(Login, { localVue, router, store, vuetify });

    expect(wrapper.find(".v-alert").exists()).toBe(true);
    expect(router.currentRoute.path).toBe("/login");
  });
});
