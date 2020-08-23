import {
  Activity,
  ActivityObject,
  ActorType,
  Link,
  OrderedCollectionPage,
} from "activitypub-objects";
import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import apiService from "@/api-client/mock/index";
import collection from "@/api-client/mock/data/collection-page-1.json";
import ActorSummarized from "@/components/actor/ActorSummarized.vue";
import { InternalActor } from "@/model/internal-actor";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/components/actor/ActorSummarized.vue", () => {
  let articles: Array<ActivityObject | Link>;
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    const user = "john.doe";
    articles = (collection as OrderedCollectionPage).orderedItems as Array<
      ActivityObject | Link
    >;
    vuetify = new Vuetify();

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
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
    });
    const content = wrapper.find(".v-list-item__title");

    expect(content.text()).toBe("Sally");
  });

  it("Actor has a icon property as a image", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".v-avatar").find(".v-icon").exists()).toBe(false);
    expect(wrapper.find(".v-avatar").find(".v-image").exists()).toBe(true);
  });

  it("Actor has no icon property and set default icon", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".v-avatar").find(".v-icon").exists()).toBe(true);
    expect(wrapper.find(".v-avatar").find(".v-image").exists()).toBe(false);
  });

  it("Actor has 'Person' type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(true);
    expect(wrapper.find(".attribute-type").text()).toBe(ActorType.PERSON);
  });

  it("Actor has no type property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".attribute-type").exists()).toBe(false);
  });

  it("Actor has summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(true);
    expect(wrapper.find(".attribute-summary").text()).toBe(
      "Nice persone you know"
    );
  });

  it("Actor has no summary property", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".attribute-summary").exists()).toBe(false);
  });

  it("Actor is following", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
    });

    const followingRemoveIcon = wrapper.find(".mdi-account-remove");
    const followingAddIcon = wrapper.find(".mdi-account-plus");
    expect(followingAddIcon.exists()).toBe(false);
    expect(followingRemoveIcon.exists()).toBe(true);
  });

  it("Actor is not followed by user", () => {
    const wrapper = mount(ActorSummarized, {
      localVue,
      propsData: {
        actor: (articles[1] as Activity).actor,
      },
      store,
      vuetify,
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
      propsData: {
        actor: {
          id: (actor as InternalActor).id,
          to: (actor as InternalActor).id,
        },
      },
      store,
      vuetify,
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
      propsData: {
        actor: (articles[0] as Activity).actor,
      },
      store,
      vuetify,
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
