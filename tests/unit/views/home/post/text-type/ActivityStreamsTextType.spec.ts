import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import { Article } from "activitypub-objects";

import collection from "@/api-client/mock/data/collection.json";
import ActivityStreamsTextType from "@/views/home/post/text-type/ActivityStreamsTextType.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActivityStreamsTextType.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let article: Article;

  beforeEach(() => {
    vuetify = new Vuetify();
    const articles = collection.orderedItems as Article[];
    article = articles[1];
  });

  it("Check data has right content", () => {
    const wrapper = mount(ActivityStreamsTextType, {
      localVue,
      vuetify,
      propsData: {
        data: article,
      },
    });

    expect(wrapper.find("span").exists()).toBe(true);
    expect(wrapper.find("span").text()).toContain("SAVIOR OF SONG");
  });
});
