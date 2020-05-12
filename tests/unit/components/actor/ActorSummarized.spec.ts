import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { ActivityObject, Link, Article, Actors } from "activitypub-objects";
import flushPromises from "flush-promises";

import store from "@/store";
import ActorSummarized from "@/components/actor/ActorSummarized.vue";
import collection from "@/api-client/mock/data/collection.json";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActorSummarized.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Array<ActivityObject | Link>;

  beforeEach(() => {
    const user = "john.doe";
    vuetify = new Vuetify();
    articles = collection.orderedItems as Array<ActivityObject | Link>;

    AuthenticationUtil.setUser(user);
    AuthenticationUtil.setToken(
      "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );
    store.dispatch("Following/fetchFollowing", "john.doe");
  });

  afterEach(() => {
    AuthenticationUtil.clear();
  });

  it("attributedTo is a object with name property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    const content = wrapper.find(".v-list-item__title");
    expect(content.text()).toBe("Sally");
  });

  it("attributedTo has a icon property as a image", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    expect(
      wrapper
        .find(".v-avatar")
        .find(".v-icon")
        .exists()
    ).toBe(false);
    expect(
      wrapper
        .find(".v-avatar")
        .find(".v-image")
        .exists()
    ).toBe(true);
  });

  it("attributedTo has no icon property and set default icon", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Article).attributedTo
      }
    });

    expect(
      wrapper
        .find(".v-avatar")
        .find(".v-icon")
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find(".v-avatar")
        .find(".v-image")
        .exists()
    ).toBe(false);
  });

  it("attributedTo has 'Person' type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(true);
    expect(wrapper.find(".attribute-type").text()).toBe(Actors.PERSON);
  });

  it("attributedTo has no type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Article).attributedTo
      }
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(false);
  });

  it("attributedTo has summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(true);
    expect(wrapper.find(".attribute-summary").text()).toBe(
      "Nice persone you know"
    );
  });

  it("attributedTo has no summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Article).attributedTo
      }
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(false);
  });

  it("Actor is following", async () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    await flushPromises();
    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(false);
    expect(followingRemoveIcon.exists()).toBe(true);
  });

  it("Actor is no following", async () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Article).attributedTo
      }
    });

    await flushPromises();
    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(true);
    expect(followingRemoveIcon.exists()).toBe(false);
  });

  it("Follow an unfollow actor", async done => {
    const actor = (articles[1] as Article).attributedTo as URL;
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: {
          id: actor,
          to: actor
        }
      }
    });

    await flushPromises().then(async () => {
      // Check actor is not follwoing
      let followingAddIcon = wrapper.find(".mdi-account-plus");
      expect(followingAddIcon.exists()).toBe(true);

      // // Click following actor
      const followingButton = wrapper.find(".following-btn");
      expect(followingButton.exists()).toBe(true);
      followingButton.trigger("click");
      // Check actor is not follwoing
      followingAddIcon = wrapper.find(".mdi-account-plus");

      await flushPromises();

      const followingRemoveIcon = wrapper.find(".mdi-account-remove");
      followingAddIcon = wrapper.find(".mdi-account-plus");
      expect(followingAddIcon.exists()).toBe(false);
      expect(followingRemoveIcon.exists()).toBe(true);
      done();
    });
  });

  it("Unfollow an follow actor", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Article).attributedTo
      }
    });

    flushPromises().then(async () => {
      // Check actor is not follwoing
      const followingRemoveIcon = wrapper.find(".mdi-account-remove");
      expect(followingRemoveIcon.exists()).toBe(true);

      // Click following actor
      const followingButton = wrapper.find(".following-btn");
      followingButton.trigger("click");

      await flushPromises();
      // Check actor is not follwoing
      const followingAddIcon = wrapper.find(".mdi-account-plus");
      expect(followingAddIcon.exists()).toBe(true);
      expect(followingRemoveIcon.exists()).toBe(false);
    });
  });
});
