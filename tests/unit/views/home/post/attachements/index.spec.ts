import {
  ActivityObject,
  Activity,
  OrderedCollectionPage,
  Link,
} from "activitypub-objects";
import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount, mount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import "@/plugins/global-directives";
import store from "@/store";
import ActivityStreamsAttachments from "@/views/home/post/attachments/index.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/index.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Activity[];

  beforeEach(() => {
    articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Check has one image", () => {
    const object = articles[0].object as ActivityObject;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: [object.attachment],
      },
      store,
      vuetify,
    });

    expect(wrapper.findAll("attachmentimage-stub").length).toBe(1);
  });

  it("Check title of image", async () => {
    const object = articles[0].object as ActivityObject;
    await flushPromises();
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: [object.attachment],
      },
      store,
      vuetify,
    });

    // await flushPromises();

    expect(wrapper.find(".v-image").attributes("aria-label")).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
  });

  it("Check url of image", () => {
    const object = articles[0].object as ActivityObject;
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: [object.attachment],
      },
      store,
      vuetify,
    });

    expect(wrapper.find(".v-image__image").attributes("style")).toContain(
      "https://picsum.photos/200"
    );
  });

  it("Check has one default link", () => {
    const object = (articles[12] as Activity).object as ActivityObject;
    const link = (object.attachment as Activity).url as Link;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: [link],
      },
      store,
      vuetify,
    });

    expect(wrapper.findAll("attachmentsimplelink-stub").length).toBe(1);
  });

  it("Attachment is empty", () => {
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: [],
      },
      store,
      vuetify,
    });

    expect(wrapper.findAll("v-col-stub").length).toBe(0);
  });

  it("Attachment is undefined", () => {
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: undefined,
      },
      store,
      vuetify,
    });

    expect(wrapper.findAll("v-col-stub").length).toBe(0);
  });

  it("Attachment without mediaType", () => {
    const object = articles[2].object as ActivityObject;
    const attachments = [object.attachment as Link];
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      propsData: {
        attachments: attachments,
      },
      store,
      vuetify,
    });

    const attachFilterLink = wrapper
      .findAll("attachmentsimplelink-stub")
      .filter(($) => $.props("title") === attachments[0].name);
    const attachFilterImage = wrapper
      .findAll("attachmentimage-stub")
      .filter(($) => $.props("title") === attachments[0].name);

    expect(attachFilterLink.length).toBe(1);
    expect(attachFilterImage.length).toBe(0);
  });
});
