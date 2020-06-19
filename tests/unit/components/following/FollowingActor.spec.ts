import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import FollowingActor from "@/components/following/FollowingActor.vue";

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
});
