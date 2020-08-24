import {
  Article,
  ActivityObject,
  Activity,
  OrderedCollectionPage,
} from "activitypub-objects";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/text-type/ActivityStreamsNoteType.vue", () => {
  let article: Article;
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    const articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];
    article = (articles[3] as Activity).object as Article;
    vuetify = new Vuetify();
  });

  it("Check note has right content", () => {
    const wrapper = mount(ActivityStreamsNoteType, {
      localVue,
      propsData: {
        data: article,
      },
      vuetify,
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.find("div").text()).toContain("A create note");
  });
});
