import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import * as actors from "@/api-client/mock/data/actors.json";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import SearchActor from "@/views/home/SearchActor.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/SearchActor.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

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
      store,
      vuetify,
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
      store,
      vuetify,
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
      store,
      vuetify,
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
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-followers-btn").trigger("click");
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(10);
  });

  it("Call second page of follower list", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-followers-btn").trigger("click");
    await flushPromises();

    // eslint-disable-next-line
    (wrapper.vm as any).nextFollowersPage()
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(12);
  });

  it("Reset search", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
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
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    expect(
      wrapper.find("#search-actor-following-btn").find("span").text()
    ).toBe("15 Follows");
  });

  it("Set new actor for detail", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-following-btn").trigger("click");
    await flushPromises();

    // eslint-disable-next-line
    (wrapper.vm as any).detail((actors as any)[3])
    await flushPromises();

    expect(wrapper.find("#summarized-name").text()).toBe("John");
  });

  it("Click following actor button of the searched actor and show first page", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-following-btn").trigger("click");
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(13);
  });

  it("Call second page of following list", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@sally.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    wrapper.find("#search-actor-following-btn").trigger("click");
    await flushPromises();

    // eslint-disable-next-line
    (wrapper.vm as any).nextFollowingPage()
    await flushPromises();

    expect(wrapper.findAll(".actor-short-list").length).toBe(15);
  });

  it("No actor found", async () => {
    const wrapper = mount(SearchActor, {
      localVue,
      store,
      vuetify,
    });

    wrapper.find("#search-field").setValue("@jimmy.example.org");
    wrapper.find("#search-btn").trigger("click");
    await flushPromises();

    expect(wrapper.find(".v-alert__content").text()).toContain(
      "No user found. You can search for and follow a user by entering its full"
    );
  });
});
