import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import "@/plugins/date-fns";
import Post from "@/views/home/post/Post.vue";
import collection from "@/api-client/mock/data/collection-page-1.json";
import { OrderedCollectionPage, Activity } from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/Post.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let activities: Activity[];

  beforeEach(async () => {
    vuetify = new Vuetify();
    activities = (collection as OrderedCollectionPage)
      .orderedItems as Activity[];
  });

  it("First post is article type", async () => {
    const post = activities[0].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find(".post").find("v-list-item-title-stub").text()).toBe(
      "Minecraft Signs"
    );
    expect(
      wrapper.find(".post").find("ActivityStreamsArticleType-stub").exists()
    ).toBe(true);
  });

  it("First post is note type", async () => {
    const post = activities[3].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find(".post").find("v-list-item-title-stub").text()).toBe(
      "A note"
    );
    expect(
      wrapper.find(".post").find("ActivityStreamsNoteType-stub").exists()
    ).toBe(true);
  });

  it("Has published date", async () => {
    const post = activities[4].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    const updateDate = wrapper.find(".post").findAll("date-stub").at(0);
    expect(updateDate.attributes().icon).toBe("mdi-publish");
    expect(updateDate.attributes().date).toBe("2020-04-28T16:12:12Z");
  });

  it("Has updated date", async () => {
    const post = activities[4].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    const updateDate = wrapper.find(".post").findAll("date-stub").at(1);
    expect(updateDate.attributes().icon).toBe("mdi-update");
    expect(updateDate.attributes().date).toBe("2020-04-28T17:49:12Z");
  });

  it("Post with 1 attachment", async () => {
    const post = activities[0].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find("attachments-stub").attributes("attachments")).toBe(
      "[object Object]"
    );
  });

  it("Post with 5 attachments", async () => {
    const post = activities[2].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find("attachments-stub").attributes("attachments")).toBe(
      "[object Object],[object Object],[object Object],[object Object],[object Object]"
    );
  });

  it("Post with an empty attachment will not render an attachment in the post", async () => {
    const post = activities[10].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find("attachments-stub").exists()).toBe(false);
  });

  it("post without attachment will not render an attachment in the post", async () => {
    const post = activities[5].object;
    const wrapper = shallowMount(Post, {
      localVue,
      vuetify,
      propsData: {
        post,
      },
    });

    expect(wrapper.find("attachments-stub").exists()).toBe(false);
  });
});
