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
    AuthenticationUtil.setUser("john.doe");
    AuthenticationUtil.setToken(
      "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );
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

  it("User is set and has a name", async (done) => {
    const wrapper = mount(Header, { localVue, vuetify, store });
    store.dispatch("User/fetchUser", AuthenticationUtil.getUser()).then(() => {
      expect(wrapper.find(".user-content").text()).toBe("john.doe");
      done();
    });
  });

  it("User is set and has an avater", async (done) => {
    const wrapper = mount(Header, { localVue, vuetify, store });
    store.dispatch("User/fetchUser", AuthenticationUtil.getUser()).then(() => {
      expect(wrapper.find(".user-content").find(".v-avatar").exists()).toBe(
        true
      );
      done();
    });
  });

  it("User is not set", () => {
    const wrapper = mount(Header, { localVue, vuetify, store });
    expect(wrapper.find(".user-content").exists()).toBe(false);
  });
});
