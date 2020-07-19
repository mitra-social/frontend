import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentSimpleLink from "@/views/home/post/attachments/AttachmentSimpleLink.vue";
import { ActivityObject, Activity } from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/AttachmentSimpleLink.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: ActivityObject[];

  beforeEach(() => {
    articles = collection.orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Image is rendering", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const url = (object.attachment as ActivityObject).url;
    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        url: url,
      },
    });

    expect(wrapper.findAll("a").length).toBe(1);
  });
});
