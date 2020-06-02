import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { Activity } from 'activitypub-objects';

import collection from "@/api-client/mock/data/collection.json";
import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActivityStreamsArticleType.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let article: Activity;

  beforeEach(() => {
    vuetify = new Vuetify();
    const articles = collection.orderedItems as Activity[];
    article = articles[0];
  });

  it("Check article has right content", () => {
    const wrapper = mount(ActivityStreamsArticleType, {
      localVue,
      vuetify,
      propsData: {
        data: article.object,
      },
    });

    expect(wrapper.find("p").exists()).toBe(true);
    expect(wrapper.find("p").text()).toContain(
      "Short-form poetry found in Minecraft maps."
    );
  });
});
