import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import SearchActor from "@/views/home/SearchActor.vue";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActors.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    const user = "john.doe";
    vuetify = new Vuetify();

    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: () => null,
    });
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");

    store.dispatch("Following/fetchFollowing", user);
    await flushPromises();
  });

  afterEach(async () => {
    store.state.Following.following = [];
    await flushPromises();
  });

  it("Find an actor who is already being followed", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find("#summarized-name").text()).toBe("Sally");
    expect(
      wrapper.find("#summarized-follow-action").find("i").classes()
    ).toContain("mdi-account-remove");
  });

  it("Find a actor you are not following yet", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@johnny.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();
    expect(wrapper.find("#summarized-name").text()).toBe("johnny");
    expect(
      wrapper.find("#summarized-follow-action").find("i").classes()
    ).toContain("mdi-account-plus");
  });

  it("Count of followers of the searched actor", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();
    expect(
      wrapper.find("#search-actor-followers-btn").find("span").text()
    ).toBe("12 Followers");
  });

  it("Click followers button of the searched actor and show first page", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-followers-btn").trigger("click");
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(10);
  });

  it("Reset search", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-field").setValue("@sally.example.org");
    await flushPromises();

    expect(wrapper.find(".v-list").exists()).toBe(false);
  });

  it("Count of following actors of the searched actor", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();
    expect(
      wrapper.find("#search-actor-following-btn").find("span").text()
    ).toBe("15 Follows");
  });

  it("Click following actor button of the searched actor and show first page", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-following-btn").trigger("click");
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(13);
  });

  it("No actor found", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      vuetify,
      store,
    });

    wrapper.find("#search-field").setValue("@jimmy.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    expect(wrapper.find(".v-alert__content").text()).toBe("No actor found.");
  });
});
