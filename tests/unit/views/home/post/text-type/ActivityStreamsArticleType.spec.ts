import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { Activity, OrderedCollectionPage } from "activitypub-objects";

import collection from "@/api-client/mock/data/collection-page-1.json";
import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActivityStreamsArticleType.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let activity: Activity;

  beforeEach(() => {
    vuetify = new Vuetify();
    const activities = (collection as OrderedCollectionPage)
      .orderedItems as Activity[];
    activity = activities[0];
  });

  it("Check article has right content", () => {
    const wrapper = mount(ActivityStreamsArticleType, {
      localVue,
      vuetify,
      propsData: {
        data: activity.object,
      },
    });

    expect(wrapper.find("p").exists()).toBe(true);
    expect(wrapper.find("p").text()).toContain(
      "Short-form poetry found in Minecraft maps."
    );
  });
});
