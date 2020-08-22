import Vue from "vue";
import Vuetify from "vuetify";
import {
  ActivityObject,
  Activity,
  Link,
  OrderedCollectionPage,
} from "activitypub-objects";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentSimpleLink from "@/views/home/post/attachments/AttachmentSimpleLink.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/AttachmentSimpleLink.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Activity[];

  beforeEach(() => {
    articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Attachment simple link exists", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;

    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: link.name,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
      },
    });

    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("Attachment simple link has url", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;

    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: link.name,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
      },
    });

    expect(wrapper.find("a").attributes("href")).toBe(
      "https://picsum.photos/200"
    );
  });

  it("Attachment simple link has title", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;

    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: link.name,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
      },
    });

    expect(wrapper.find("a").text()).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
  });

  it("Attachment simple link without name", async () => {
    const object = (articles[13] as Activity).object as ActivityObject;
    const link = (object.attachment as Activity).url as Link;

    const wrapper = shallowMount(AttachmentSimpleLink, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: link.name,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
      },
    });

    expect(wrapper.find("a").text()).toBe("http://example.com");
  });
});
