import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import {
  ActivityObject,
  Link,
  ActorType,
  Activity,
  OrderedCollectionPage,
} from "activitypub-objects";
import flushPromises from "flush-promises";

import store from "@/store";
import ActorSummarized from "@/components/actor/ActorSummarized.vue";
import apiService from "@/api-client/mock/index";
import collection from "@/api-client/mock/data/collection-page-1.json";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { User } from "@/model/user";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActorSummarized.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Array<ActivityObject | Link>;

  beforeEach(async () => {
    const user = "john.doe";
    vuetify = new Vuetify();
    articles = (collection as OrderedCollectionPage).orderedItems as Array<
      ActivityObject | Link
    >;

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");

    store.dispatch("Following/fetchFollowing", "john.doe");
    await flushPromises();
  });

  afterEach(async () => {
    AuthenticationUtil.clear();
    // eslint-disable-next-line
    const jestReset = (apiService as any).getJestReset();
    jestReset();
    await flushPromises();
  });

  it("Actor is a object with name property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });
    const content = wrapper.find(".v-list-item__title");
    expect(content.text()).toBe("Sally");
  });

  it("Actor has a icon property as a image", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });

    expect(wrapper.find(".v-avatar").find(".v-icon").exists()).toBe(false);
    expect(wrapper.find(".v-avatar").find(".v-image").exists()).toBe(true);
  });

  it("Actor has no icon property and set default icon", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
    });

    expect(wrapper.find(".v-avatar").find(".v-icon").exists()).toBe(true);
    expect(wrapper.find(".v-avatar").find(".v-image").exists()).toBe(false);
  });

  it("Actor has 'Person' type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(true);
    expect(wrapper.find(".attribute-type").text()).toBe(ActorType.PERSON);
  });

  it("Actor has no type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(false);
  });

  it("Actor has summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(true);
    expect(wrapper.find(".attribute-summary").text()).toBe(
      "Nice persone you know"
    );
  });

  it("Actor has no summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(false);
  });

  it("Actor is following", async () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });

    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(false);
    expect(followingRemoveIcon.exists()).toBe(true);
  });

  it("Actor is not followed by user", async () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
    });

    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(true);
    expect(followingRemoveIcon.exists()).toBe(false);
  });

  it("User follows an unfollowed actor", async () => {
    const actor = (articles[1] as Activity).actor;
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: {
          id: (actor as User).id,
          to: (actor as User).id,
        },
      },
    });

    // Check actor is not follwoing
    let followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(true);

    // // Click following actor
    const followingButton = wrapper.find(".following-btn");
    expect(followingButton.exists()).toBe(true);
    followingButton.trigger("click");
    await flushPromises();

    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(false);
    expect(followingRemoveIcon.exists()).toBe(true);
  });

  it("User unfollows a followed actor", async () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      vuetify,
      store,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
    });

    // Check actor is not follwoing
    expect(wrapper.find(".mdi-account-remove").exists()).toBe(true);

    // Click following actor
    wrapper.find(".following-btn").trigger("click");

    await flushPromises();
    // Check actor is not follwoing
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(true);
    expect(wrapper.find(".mdi-account-remove").exists()).toBe(false);
  });
});
