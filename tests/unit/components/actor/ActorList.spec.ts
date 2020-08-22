import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import ActorList from "@/components/actor/ActorList.vue";
import store from "@/store";
import * as followingPage1Data from "@/api-client/mock/data/following-page-1.json";
import * as followerPage1Data from "@/api-client/mock/data/followers-page-1.json";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { OrderedCollectionPage } from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/components/actor/ActorList.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let followingPage1: OrderedCollectionPage;
  let followerPage1: OrderedCollectionPage;

  beforeEach(async () => {
    vuetify = new Vuetify();
    const user = "john.doe";

    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: () => null,
    });
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);

    // eslint-disable-next-line
    followingPage1 = (followingPage1Data.default as any) as OrderedCollectionPage;
    // eslint-disable-next-line
    followerPage1 = (followerPage1Data.default as any) as OrderedCollectionPage;

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    store.dispatch("Following/fetchFollowing", user);
    await flushPromises();
  });

  it("Count list with following actors", () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followingPage1.orderedItems,
      },
    });

    expect(wrapper.findAll(".actor-short-list").length).toBe(13);
  });

  it("Following actors has next page", (done) => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followingPage1.orderedItems,
        hasNextPage: true,
      },
    });

    const intersectArray = [
      {
        isIntersecting: true,
        target: {
          getAttribute: () => {
            return wrapper.findAll(".actor-short-list").length - 2;
          },
        },
      },
    ];
    // eslint-disable-next-line
    (wrapper.vm as any).onIntersect(intersectArray);

    flushPromises().then(async () => {
      expect(wrapper.emitted().nextPage).toBeTruthy();
      done();
    });
  });

  it("Following actors has not next page", (done) => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followingPage1.orderedItems,
        hasNextPage: false,
      },
    });

    const intersectArray = [
      {
        isIntersecting: true,
        target: {
          getAttribute: () => {
            return wrapper.findAll(".actor-short-list").length - 2;
          },
        },
      },
    ];
    // eslint-disable-next-line
    (wrapper.vm as any).onIntersect(intersectArray);

    flushPromises().then(async () => {
      expect(wrapper.emitted().nextPage).toBeFalsy();
      done();
    });
  });

  it("Count list with following actors", () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followerPage1.orderedItems,
      },
    });

    expect(wrapper.findAll(".actor-short-list").length).toBe(10);
  });

  it("Check first actor", async () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followerPage1.orderedItems,
      },
    });

    const firstActorItem = wrapper.findAll(".actor-short-list").at(0);
    firstActorItem.trigger("click");
    await flushPromises();

    expect(firstActorItem.find("#summarized-name").text()).toBe("Jenny");
    expect(firstActorItem.find("#summarized-type").text()).toBe("Person");
  });

  it("List is empty", () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {},
    });

    expect(wrapper.findAll(".actor-short-list").length).toBe(0);
  });

  it("Loading is false and the progress bar is inactive", () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followerPage1.orderedItems,
        isLoading: false,
      },
    });

    expect(
      wrapper.find(".v-progress-linear__indeterminate--active").exists()
    ).toBe(false);
  });

  it("Loading is true and the progress bar is active", () => {
    const wrapper = mount(ActorList, {
      localVue,
      vuetify,
      store,
      propsData: {
        actors: followerPage1.orderedItems,
        isLoading: true,
        hasNextPage: false,
      },
    });

    expect(
      wrapper.find(".v-progress-linear__indeterminate--active").exists()
    ).toBe(true);
  });
});
