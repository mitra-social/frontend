import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount, mount } from "@vue/test-utils";

import "@/plugins/date-fns";
import "@/plugins/global-directives";
import router from "@/router";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import Home from "@/views/home/index.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/index.vue", () => {
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
    store.state.Dialog.isOpen = false;
    await flushPromises();
  });

  // user info
  it("User is set and has a name", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    expect(wrapper.find("#user-name").text()).toBe("john.doe");
  });

  it("User is set and has a e-mail", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    expect(wrapper.find("#user-email").text()).toBe("test@mail.ch");
  });

  it("User is set and has an avater", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });
    expect(wrapper.find("#user-icon").exists()).toBe(true);
  });

  // dark mode switcher
  it("Switch to dark mode", async () => {
    const wrapper = mount(Home, {
      localVue,
      store,
      vuetify,
    });

    expect(wrapper.vm.$vuetify.theme.dark).toBe(false);
    expect(wrapper.find("#dark-mode-icon").find("i").classes()).toContain(
      "mdi-white-balance-sunny"
    );

    const darkMode = wrapper.find("#dark-mode-switcher");
    darkMode.trigger("click");
    await flushPromises();

    expect(wrapper.vm.$vuetify.theme.dark).toBe(true);
    expect(wrapper.find("#dark-mode-icon").find("i").classes()).toContain(
      "mdi-moon-waning-crescent"
    );
  });

  it("Switch return to light mode", async () => {
    const wrapper = mount(Home, {
      localVue,
      store,
      vuetify,
    });

    expect(wrapper.vm.$vuetify.theme.dark).toBe(false);
    expect(wrapper.find("#dark-mode-icon").find("i").classes()).toContain(
      "mdi-white-balance-sunny"
    );

    wrapper.find("#dark-mode-switcher").trigger("click");
    await flushPromises();

    expect(wrapper.vm.$vuetify.theme.dark).toBe(true);
    expect(wrapper.find("#dark-mode-icon").find("i").classes()).toContain(
      "mdi-moon-waning-crescent"
    );

    wrapper.find("#dark-mode-switcher").trigger("click");
    await flushPromises();

    expect(wrapper.vm.$vuetify.theme.dark).toBe(false);
    expect(wrapper.find("#dark-mode-icon").find("i").classes()).toContain(
      "mdi-white-balance-sunny"
    );
  });

  // setting items
  it("Has 1 settings item", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    expect(wrapper.findAll(".setting-item").length).toBe(1);
  });

  it("Profile link exists", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    const profile = wrapper.findAll(".setting-item").at(0);
    expect(profile.exists()).toBe(true);
    expect(profile.find("v-list-item-title-stub").text()).toBe("Profile");
  });

  it("Profile link has icon", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    const icon = wrapper.findAll(".setting-item").at(0).find("v-icon-stub");
    expect(icon.exists()).toBe(true);
    expect(icon.text()).toBe("mdi-account");
  });

  it("Open dialog when clicked setting profile link", async () => {
    const wrapper = mount(Home, {
      localVue,
      store,
      vuetify,
    });
    const password = wrapper.findAll(".setting-item").at(0);

    expect(store.state.Dialog.isOpen).toBe(false);
    password.trigger("click");
    await flushPromises();

    expect(store.state.Dialog.isOpen).toBe(true);
    expect(store.state.Dialog.title).toBe("Profile");
    expect(store.state.Dialog.component).toBe("Profile");
  });

  // logout
  it("Logout link exists", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    const logout = wrapper.find("#logout-item");
    expect(logout.exists()).toBe(true);
    expect(logout.find("v-list-item-title-stub").text()).toBe("Logout");
  });

  it("Logout link has icon", () => {
    const wrapper = shallowMount(Home, { localVue, store, vuetify });

    const icon = wrapper.find("#logout-item").find("v-icon-stub");
    expect(icon.exists()).toBe(true);
    expect(icon.text()).toBe("mdi-logout-variant");
  });

  it("Click logout button", async () => {
    const wrapper = mount(Home, {
      localVue,
      router,
      store,
      vuetify,
    });

    expect(router.currentRoute.path).toBe("/");

    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(undefined);
    const logout = wrapper.find("#logout-item");
    logout.trigger("click");
    await flushPromises();

    expect(router.currentRoute.path).toBe("/login");
  });
});
