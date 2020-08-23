import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount } from "@vue/test-utils";

import apiService from "@/api-client/mock/index";
import { Notify } from "@/model/notify";
import "@/plugins/date-fns";
import router from "@/router";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import Posts from "@/views/home/post/Posts.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/Posts.vue", () => {
  const mockIntersectDirective = () => {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
    };
  };
  const userName = "john.doe";
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    if (router.currentRoute.path !== "/") {
      router.push({ name: "Home" });
    }

    store.state.User.user = {
      userId: "id",
      email: "test@mail.ch",
      registeredAt: new Date(),
      preferredUsername: userName,
      inbox: "https://social.example/john.doe/inbox/",
    };

    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(userName);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    await flushPromises();
  });

  afterEach(async () => {
    AuthenticationUtil.clear();
    store.commit("Collection/reset");

    // eslint-disable-next-line
    const jestReset = (apiService as any).getJestReset();
    jestReset();
    await flushPromises();
  });

  it("Count posts", async () => {
    const wrapper = shallowMount(Posts, {
      directives: { Intersect: mockIntersectDirective },
      localVue,
      vuetify,
      store,
    });
    await flushPromises();

    expect(wrapper.findAll("post-stub").length).toBe(12);
  });

  it("Test scroll paging", async () => {
    const wrapper = shallowMount(Posts, {
      directives: { Intersect: mockIntersectDirective },
      localVue,
      store,
      vuetify,
    });
    await flushPromises();

    expect(wrapper.findAll("post-stub").length).toBe(12);

    const intersectArray = [
      {
        isIntersecting: true,
        target: {
          getAttribute: () => {
            return wrapper.findAll("post-stub").length - 2;
          },
        },
      },
    ];
    // eslint-disable-next-line
    (wrapper.vm as any).onIntersect(intersectArray);
    await flushPromises();

    expect(wrapper.findAll("post-stub").length).toBe(17);
  });

  it("Wrong user", (done) => {
    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("jenny.moe");
    const wrapper = shallowMount(Posts, {
      directives: { Intersect: mockIntersectDirective },
      localVue,
      store,
      vuetify,
    });

    wrapper.vm.$store.subscribe((mutation, state) => {
      if (mutation.type === "Notify/setNofify") {
        const notification: Notify = state.Notify.notification;
        expect(notification.message).toBe("Authentication is incorrect");
      }
    });
    done();
  });

  it("Has no post", async () => {
    const wrapper = shallowMount(Posts, {
      directives: { Intersect: mockIntersectDirective },
      localVue,
      store,
      vuetify,
    });
    await flushPromises();

    store.state.Collection.items = [];
    await flushPromises();
    // The information about no existing post is in a class post
    expect(wrapper.findAll(".post").length).toBe(1);
    expect(wrapper.find("v-card-text-stub").text()).toContain(
      "You haven't got any posts yet because"
    );
  });

  it("No user was found and therefore no posts can be displayed", () => {
    store.state.User.user = undefined;
    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(undefined);

    shallowMount(Posts, {
      directives: { Intersect: mockIntersectDirective },
      localVue,
      store,
      vuetify,
    });

    expect(router.currentRoute.path).toBe("/login");
  });
});
