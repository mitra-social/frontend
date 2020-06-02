import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import { Article, ActivityObject, Activity } from "activitypub-objects";

import collection from "@/api-client/mock/data/collection.json";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActivityStreamsNoteType.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let article: Article;

  beforeEach(() => {
    vuetify = new Vuetify();
    const articles = collection.orderedItems as ActivityObject[];
    article = (articles[3] as Activity).object as Article;
  });

  it("Check note has right content", () => {
    const wrapper = mount(ActivityStreamsNoteType, {
      localVue,
      vuetify,
      propsData: {
        data: article,
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.find("div").text()).toContain("A create note");
  });
});
