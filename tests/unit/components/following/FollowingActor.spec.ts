import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import FollowingActor from "@/components/following/FollowingActor.vue";
import store from "@/store";
import flushPromises from "flush-promises";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { InternalActor } from "@/model/internal-actor";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActor.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const user = "john.doe";

  beforeEach(async () => {
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    store.dispatch("Following/fetchFollowing", user);
    await flushPromises();
  });

  it("Actor is an object with preferredUsername property and no icon", () => {
    const preferredUsername = "john.doe";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      propsData: {
        actor: {
          type: "Person",
          preferredUsername: preferredUsername,
        },
      },
    });

    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(preferredUsername);

    const avatarIconElement = wrapper.findAll(
      ".v-list-item__avatar .mdi-account-circle"
    );
    expect(avatarIconElement.length).toBe(1);

    const avatarImgElement = wrapper.findAll(".v-list-item__avatar .v-image");
    expect(avatarImgElement.length).toBe(0);
  });

  it("Actor is an object with preferredUsername and name property and icon", () => {
    const name = "John";
    const iconUrl = "http://example.org/icon.png";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      propsData: {
        actor: {
          type: "Person",
          preferredUsername: "john.doe",
          name: name,
          icon: {
            type: "Image",
            name: "Avatar",
            url: iconUrl,
            width: 16,
            height: 16,
          },
        },
      },
    });

    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(name);

    const avatarImgElement = wrapper.findAll(".v-list-item__avatar .v-image");
    expect(avatarImgElement.length).toBe(1);
  });

  it("Actor is an object with preferredUsername, name and nameMap with required language property", () => {
    const name = "John";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      propsData: {
        actor: {
          type: "Person",
          preferredUsername: "john.doe",
          name: "Foo",
          nameMap: {
            de: "Hans",
            fr: "Jean",
            en: name,
          },
        },
      },
    });

    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(name);
  });

  it("Actor is an object with preferredUsername, name and nameMap without required language property", () => {
    const name = "Foo";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      propsData: {
        actor: {
          type: "Person",
          preferredUsername: "john.doe",
          name: name,
          nameMap: {
            de: "Hans",
            fr: "Jean",
          },
        },
      },
    });

    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(name);
  });

  it("Hover list item", async () => {
    const actor: InternalActor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor,
      },
    });

    // Find only button icon of item action
    expect(wrapper.find(".item-action").findAll(".v-icon").length).toBe(1);

    wrapper.setData({ isHover: true });
    await flushPromises();

    expect(wrapper.find(".mdi-filter-plus-outline").exists()).toBe(true);
  });

  it("Filter posts by first actor in following list", async () => {
    const actor: InternalActor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor,
      },
    });

    // Find only button icon of item action
    expect(wrapper.find(".item-action").findAll(".v-icon").length).toBe(1);

    const listItem = wrapper.find(".v-list-item");
    listItem.trigger("click");
    await wrapper.vm.$nextTick();
    wrapper.setData({ disabledFilter: true });
    await flushPromises();

    expect(wrapper.vm.$store.getters["Collection/getPosts"].length).toBe(6);
    expect(wrapper.vm.$store.state.Collection.filter).toBe(actor.internalUserId);
    expect(wrapper.find(".mdi-filter-outline").exists()).toBe(true);
  });

  it("Filter is set and hover list item", async () => {
    const actor: InternalActor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor,
      },
    });

    // Find only button icon of item action
    expect(wrapper.find(".item-action").findAll(".v-icon").length).toBe(1);

    const listItem = wrapper.find(".v-list-item");
    listItem.trigger("click");
    await wrapper.vm.$nextTick();
    wrapper.setData({ disabledFilter: true });
    wrapper.setData({ isHover: true });
    await flushPromises();

    expect(wrapper.find(".mdi-filter-remove-outline").exists()).toBe(true);
  });

  it("Remove filter by first actor in following list", async () => {
    const actor: InternalActor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor,
      },
    });

    // Find only button icon of item action
    expect(wrapper.find(".item-action").findAll(".v-icon").length).toBe(1);

    const listItem = wrapper.find(".v-list-item");
    listItem.trigger("click");
    await wrapper.vm.$nextTick();
    wrapper.setData({ disabledFilter: true });
    await flushPromises();

    listItem.trigger("click");
    await wrapper.vm.$nextTick();
    wrapper.setData({ disabledFilter: false });
    await flushPromises();

    expect(wrapper.vm.$store.getters["Collection/getPosts"].length).toBe(12);
    expect(wrapper.vm.$store.state.Collection.filter).toBe(undefined);
    // Find only button icon of item action
    expect(wrapper.find(".item-action").findAll(".v-icon").length).toBe(1);
  });

  it("User unfollows a followed actor", async () => {
    const actor: InternalActor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor,
      },
    });

    expect(wrapper.vm.$store.state.Following.following.length).toBe(5);

    wrapper.find(".following-btn").trigger("click");
    await flushPromises();

    expect(wrapper.vm.$store.state.Following.following.length).toBe(4);
  });
});
