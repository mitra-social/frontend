import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import "@/plugins/vuetify-toast-snackbar";
import store from "@/store";
import Posts from "@/views/home/post/Posts.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Posts.vue", () => {
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
    store.state.Collection.items = [];
  });

  it("Count posts", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, { localVue, vuetify, store });
    const spy = jest.spyOn(wrapper.vm.$toast, "error");
    await flushPromises();
    expect(wrapper.findAll(".post").length).toBe(9);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("First post is article type", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, { localVue, vuetify, store });
    const spy = jest.spyOn(wrapper.vm.$toast, "error");
    await flushPromises();
    expect(
      wrapper.findAll(".post").at(0).find("v-list-item-title-stub").text()
    ).toBe("Minecraft Signs");
    expect(
      wrapper
        .findAll(".post")
        .at(0)
        .find("ActivityStreamsArticleType-stub")
        .exists()
    ).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("Wrong user", async () => {
    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("jenny.moe");

    const wrapper = shallowMount(Posts, { localVue, vuetify, store });
    const spy = jest.spyOn(wrapper.vm.$toast, "error");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
  });
});
