import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection.json";
import ActivityStreamsAttachments from "@/views/home/post/attachments/index.vue";
import { ActivityObject, Activity } from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/index.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: ActivityObject[];

  beforeEach(() => {
    articles = collection.orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Check has one image", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll(".v-image").length).toBe(1);
  });

  it("Check has two image", async () => {
    const object = (articles[1] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll(".v-image").length).toBe(2);
  });
});
