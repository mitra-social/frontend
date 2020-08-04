import Vue from "vue";
import Vuetify from "vuetify";
import { ActivityObject, Activity, Link } from "activitypub-objects";

import { mount, createLocalVue } from "@vue/test-utils";

import "@/plugins/global-directives";
import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentImage from "@/views/home/post/attachments/AttachmentImage.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/AttachmentImage.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Activity[];

  beforeEach(() => {
    articles = collection.orderedItems as Activity[];
    vuetify = new Vuetify();
  });

  it("Image is rendering", async () => {
    const object = articles[0].object as ActivityObject;
    const attach = [object.attachment as Link];
    const wrapper = mount(AttachmentImage, {
      localVue,
      vuetify,
      propsData: {
        attach,
      },
    });

    expect(wrapper.findAll(".v-image").length).toBe(1);
  });
});
