import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import "@/plugins/date-fns";
import store from "@/store";
import router from "@/router";
import Posts from "@/views/home/post/Posts.vue";
import apiService from "@/api-client/mock/index";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { Notify } from "@/model/notify";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/Posts.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const userName = "john.doe";
  const mockIntersectDirective = () => {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
    };
  };

  beforeEach(async () => {
    vuetify = new Vuetify();

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
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();
    expect(wrapper.findAll("post-stub").length).toBe(12);
  });

  it("Test scroll paging", async (done) => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
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

    flushPromises().then(async () => {
      expect(wrapper.findAll("post-stub").length).toBe(17);
      done();
    });
  });

  it("Wrong user", async (done) => {
    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("jenny.moe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
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
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
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

  it("No user was found and therefore no posts can be displayed", async () => {
    store.state.User.user = undefined;
    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(undefined);

    shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });

    expect(router.currentRoute.path).toBe("/login");
  });
});
