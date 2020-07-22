import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentSimpleLink from "@/views/home/post/attachments/AttachmentSimpleLink.vue";
import { ActivityObject, Activity, Link } from "activitypub-objects";

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

  it("Attachment simple link exists", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const url = (object.attachment as ActivityObject).url;
    const title = (object.attachment as ActivityObject).name;
    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        url,
        title,
      },
    });

    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("Attachment simple link has url", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const url = (object.attachment as ActivityObject).url;
    const title = (object.attachment as ActivityObject).name;
    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        url,
        title,
      },
    });

    expect(wrapper.find("a").attributes("href")).toBe(
      "https://picsum.photos/200"
    );
  });

  it("Attachment simple link has title", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const url = ((object.attachment as ActivityObject).url as Link).href;
    const title = (object.attachment as ActivityObject).name;
    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        url,
        title,
      },
    });

    expect(wrapper.find("a").text()).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
  });

  it("Attachment simple link without name", async () => {
    const object = (articles[13] as Activity).object as ActivityObject;
    const url = ((object.attachment as ActivityObject).url as Link).href;
    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        url,
      },
    });

    expect(wrapper.find("a").text()).toBe("http://example.com");
  });
});
