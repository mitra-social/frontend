import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import FollowingActor from "@/components/following/FollowingActor.vue";
import store from "@/store";
import flushPromises from "flush-promises";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActor.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Actor is an object with preferredUsername property and no icon", () => {
    const preferredUsername = "john.doe";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      propsData: {
        following: {
          actor: {
            type: "Person",
            preferredUsername: preferredUsername,
          },
          show: true,
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
        following: {
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
          show: true,
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
        following: {
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
          show: true,
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
        following: {
          actor: {
            type: "Person",
            preferredUsername: "john.doe",
            name: name,
            nameMap: {
              de: "Hans",
              fr: "Jean",
            },
          },
          show: true,
        },
      },
    });

    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(name);
  });

  it("Toggle exclude all actors from posts", async () => {
    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    store.dispatch("Following/fetchFollowing", "john.doe");
    await flushPromises();
    const actor = store.state.Following.following[0];

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        following: actor,
      },
    });

    // created() state of excluded actors
    expect(wrapper.findAll(".mdi-eye").length).toBe(1);
    expect(wrapper.findAll(".mdi-eye-off").length).toBe(0);

    // exclude all actors
    let button = wrapper.find("#add-exclude-actor-btn");
    button.trigger("click");
    await flushPromises();

    expect(wrapper.vm.$store.state.Collection.excludedActors.length).toBe(1);
    expect(wrapper.find(".mdi-eye").exists()).toBe(false);
    expect(wrapper.find(".mdi-eye-off").exists()).toBe(true);

    // Remove exclude all actors
    button = wrapper.find("#remove-exclude-actor-btn");
    button.trigger("click");
    await flushPromises();

    expect(wrapper.vm.$store.state.Collection.excludedActors.length).toBe(0);
    expect(wrapper.find(".mdi-eye").exists()).toBe(true);
    expect(wrapper.find(".mdi-eye-off").exists()).toBe(false);
  });
});
