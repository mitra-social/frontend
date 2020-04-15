import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import Article from "@/views/home/post/Article.vue";
import collection from "@/api/mock/data/collection.json";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Article.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let article: Article;

  beforeEach(() => {
    vuetify = new Vuetify();
    const articles = collection.orderedItems as Article[];
    article = articles[0];
  });

  it("Check article has right content", () => {
    const wrapper = mount(Article, {
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
