import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, mount } from "@vue/test-utils";

import Header from "@/components/layout/MitraHeader.vue";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Header.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
  });

  afterEach(() => {
    AuthenticationUtil.clear();
    store.state.User.user = undefined;
  });

  it("Is mitra logo set", () => {
    const wrapper = mount(Header, { localVue, vuetify, store });
    expect(wrapper.find(".header-logo").attributes("src")).toBe(
      "@/assets/mitra-logo-white.png"
    );
  });

  it("User is not set", () => {
    const wrapper = mount(Header, { localVue, vuetify, store });
    expect(wrapper.find(".user-content").exists()).toBe(false);
  });
});
