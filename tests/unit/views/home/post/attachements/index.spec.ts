import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
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
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll("attachmentimage-stub").length).toBe(1);
  });

  it("Check title of image", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.find("attachmentimage-stub").props("title")).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
  });

  it("Check url of image", async () => {
    const object = (articles[0] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.find("attachmentimage-stub").props("url")).toBe(
      "https://picsum.photos/200"
    );
  });

  it("Check has two image", async () => {
    const object = (articles[1] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll("attachmentimage-stub").length).toBe(2);
  });

  it("Check has one default link", async () => {
    const object = (articles[12] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll("attachmentsimplelink-stub").length).toBe(1);
  });

  it("Check title of default link", async () => {
    const object = (articles[12] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.find("attachmentsimplelink-stub").props("title")).toBe(
      "Default link test"
    );
  });

  it("Check url of default link", async () => {
    const object = (articles[12] as Activity).object as ActivityObject;
    const attachments = object.attachment;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.find("attachmentsimplelink-stub").props("url")).toBe(
      "http://example.com"
    );
  });

  it("Attachment is empty", () => {
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: [],
      },
    });

    expect(wrapper.findAll("v-col-stub").length).toBe(0);
  });

  it("Attachment is undefined", () => {
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: undefined,
      },
    });

    expect(wrapper.findAll("v-col-stub").length).toBe(0);
  });

  it("Attachment without mediaType", async () => {
    const object = (articles[2] as Activity).object as ActivityObject;
    const attachments = object.attachment as ActivityObject[];
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
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

  it("Attachment without name", async () => {
    const object = (articles[2] as Activity).object as ActivityObject;
    const attachments = object.attachment as ActivityObject[];
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    expect(wrapper.findAll("attachmentimage-stub").at(0).props("title")).toBe(
      undefined
    );
  });

  it("Attachment without url", async () => {
    const object = (articles[2] as Activity).object as ActivityObject;
    const attachments = object.attachment as ActivityObject[];
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      vuetify,
      propsData: {
        attachments: attachments,
      },
    });

    const attachFilterLink = wrapper
      .findAll("attachmentsimplelink-stub")
      .filter(($) => $.props("title") === attachments[3].name);
    const attachFilterImage = wrapper
      .findAll("attachmentimage-stub")
      .filter(($) => $.props("title") === attachments[3].name);

    expect(wrapper.findAll("v-col-stub").length).toBe(4);
    expect(attachFilterLink.length).toBe(0);
    expect(attachFilterImage.length).toBe(0);
  });
});
