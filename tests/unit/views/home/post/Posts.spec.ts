import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import Posts from "@/views/home/post/Posts.vue";
import apiService from "@/api-client/mock/index";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { Notify } from "@/model/notify";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Posts.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
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
      preferredUsername: "john.doe",
      inbox: "https://social.example/john.doe/inbox/",
    };

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
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
    expect(wrapper.findAll(".post").length).toBe(12);
  });

  it("Test scroll paging", async (done) => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(wrapper.findAll(".post").length).toBe(12);

    const intersectArray = [
      {
        isIntersecting: true,
        target: {
          getAttribute: () => {
            return wrapper.findAll(".post").length - 2;
          },
        },
      },
    ];
    // eslint-disable-next-line
    (wrapper.vm as any).onIntersect(intersectArray);
    flushPromises().then(async () => {
      expect(wrapper.findAll(".post").length).toBe(17);
      done();
    });
  });

  it("First post is article type", async () => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();
    expect(
      wrapper.findAll(".post").at(0).find("v-list-item-title-stub").text()
    ).toBe("Minecraft Signs");
    expect(
      wrapper
        .findAll(".post")
        .at(0)
        .find("ActivityStreamsArticleType-stub")
        .exists()
    ).toBe(true);
  });

  it("First post is note type", async () => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();
    expect(
      wrapper.findAll(".post").at(3).find("v-list-item-title-stub").text()
    ).toBe("A note");
    expect(
      wrapper
        .findAll(".post")
        .at(3)
        .find("ActivityStreamsNoteType-stub")
        .exists()
    ).toBe(true);
  });

  it("Has published date", async () => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    const updateDate = wrapper
      .findAll(".post")
      .at(4)
      .findAll("date-stub")
      .at(0);
    expect(updateDate.attributes().icon).toBe("mdi-publish");
    expect(updateDate.attributes().date).toBe("2020-04-28T16:12:12Z");
  });

  it("Has updated date", async () => {
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    const updateDate = wrapper
      .findAll(".post")
      .at(4)
      .findAll("date-stub")
      .at(1);
    expect(updateDate.attributes().icon).toBe("mdi-update");
    expect(updateDate.attributes().date).toBe("2020-04-28T17:49:12Z");
  });

  it("8 posts has attachments", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();
    expect(wrapper.findAll("attachments-stub").length).toBe(7);
  });

  it("Post with 1 attachment", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(
      wrapper.findAll("attachments-stub").at(0).attributes("attachments")
    ).toBe("[object Object]");
  });

  it("Post with 1 attachment", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(
      wrapper.findAll("attachments-stub").at(0).attributes("attachments")
    ).toBe("[object Object]");
  });

  it("Post with 5 attachments", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(
      wrapper.findAll("attachments-stub").at(2).attributes("attachments")
    ).toBe(
      "[object Object],[object Object],[object Object],[object Object],[object Object]"
    );
  });

  it("Post with an empty attachment will not render an attachment in the post", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(
      wrapper.findAll(".post").at(7).find("attachments-stub").exists()
    ).toBe(false);
  });

  it("post without attachment will not render an attachment in the post", async () => {
    AuthenticationUtil.setUser("john.doe");
    const wrapper = shallowMount(Posts, {
      localVue,
      vuetify,
      store,
      directives: { Intersect: mockIntersectDirective },
    });
    await flushPromises();

    expect(
      wrapper.findAll(".post").at(4).find("attachments-stub").exists()
    ).toBe(false);
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
    expect(wrapper.findAll(".post").length).toBe(1);
    expect(wrapper.find("v-card-text-stub").text()).toContain(
      "You haven't got any posts yet because"
    );
  });
});
