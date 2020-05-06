import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { ActivityObject, Link, Article, Actors } from "activitypub-objects";

import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import FollowingActor from "@/components/following/FollowingActor.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActor.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let actors: Array<ActivityObject | Link>;

  beforeEach(() => {
    const user = "john.doe";
    vuetify = new Vuetify();

    AuthenticationUtil.setUser(user);
    AuthenticationUtil.setToken(
        "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );
    store.dispatch("Following/fetchFollowing", "john.doe");
  });

  it("actor is an object with preferredUsername property and no icon", () => {
    const preferredUsername = "john.doe";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: {
          "type": "Person",
          "preferredUsername": preferredUsername,
        }
      }
    });
    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(preferredUsername);
    const avatarElement = wrapper.find(".v-list-item__avatar");
    expect(avatarElement.find("mdi-account-circle")).not.toBeNull();
  });

  it("actor is an object with preferredUsername and name property and icon", () => {
    const name = "John";
    const iconUrl = "http://example.org/icon.png";

    const wrapper = mount(FollowingActor, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: {
          "type": "Person",
          "preferredUsername": "john.doe",
          "name": name,
          "icon": {
            "type": "Image",
            "name": "Avatar",
            "url": iconUrl,
            "width": 16,
            "height": 16
          }
        }
      }
    });
    const displayNameElement = wrapper.find(".v-list-item__title");
    expect(displayNameElement.text()).toBe(name);
    const avatarImgElement = wrapper.find(".v-list-item__avatar img");
    expect(avatarImgElement.html()).toBe(iconUrl);
  });
});
