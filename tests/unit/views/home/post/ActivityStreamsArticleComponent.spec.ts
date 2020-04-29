import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import ActivityStreamsArticle from "@/views/home/post/ActivityStreamsArticle.vue";
import collection from "@/api-client/mock/data/collection.json";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActivityStreamsArticleComponent.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let article: ActivityStreamsArticle;

  beforeEach(() => {
    vuetify = new Vuetify();
    const articles = collection.orderedItems as ActivityStreamsArticle[];
    article = articles[0];
  });

  it("Check article has right content", () => {
    const wrapper = mount(ActivityStreamsArticle, {
      localVue,
      vuetify,
      propsData: {
        data: article
      }
    });

    expect(wrapper.find("p").exists()).toBe(true);
    expect(wrapper.find("p").text()).toContain(
      "Short-form poetry found in Minecraft maps."
    );
  });
});
