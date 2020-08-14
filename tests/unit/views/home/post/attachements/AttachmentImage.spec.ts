import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentImage from "@/views/home/post/attachments/AttachmentImage.vue";
import {
  ActivityObject,
  Activity,
  OrderedCollectionPage,
} from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/AttachmentImage.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: ActivityObject[];

  beforeEach(() => {
    articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Image is rendering", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const url = (object.attachment as ActivityObject).url;
    const wrapper = mount(AttachmentImage, {
      localVue,
      vuetify,
      propsData: {
        url: url,
      },
    });

    expect(wrapper.findAll(".v-image").length).toBe(1);
  });
});
