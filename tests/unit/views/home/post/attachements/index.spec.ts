import Vue from "vue";
import Vuetify from "vuetify";
import { ActivityObject, Activity, Link } from "activitypub-objects";

import { createLocalVue, shallowMount, mount } from "@vue/test-utils";

import "@/plugins/global-directives";
import store from "@/store";
import collection from "@/api-client/mock/data/collection-page-1.json";
import ActivityStreamsAttachments from "@/views/home/post/attachments/index.vue";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/index.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Activity[];

  beforeEach(() => {
    articles = collection.orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Check has one image", async () => {
    const object = articles[0].object as ActivityObject;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      store,
      vuetify,
      propsData: {
        attachments: [object.attachment],
      },
    });

    expect(wrapper.findAll("attachmentimage-stub").length).toBe(1);
  });

  it("Check title of image", async () => {
    const object = articles[0].object as ActivityObject;
    console.log([object.attachment]);
    await flushPromises();
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      store,
      vuetify,
      propsData: {
        attachments: [object.attachment],
      },
    });

    await flushPromises();

    expect(wrapper.find(".v-image").attributes("aria-label")).toBe(
      "Minecraft Signs"
    );
  });

  it("Check url of image", async () => {
    const object = articles[0].object as ActivityObject;
    const wrapper = mount(ActivityStreamsAttachments, {
      localVue,
      store,
      vuetify,
      propsData: {
        attachments: [object.attachment],
      },
    });

    expect(wrapper.find(".v-image__image").attributes("style")).toContain(
      "https://picsum.photos/200"
    );
  });

  it("Check has one default link", async () => {
    const object = (articles[12] as Activity).object as ActivityObject;
    const link = (object.attachment as Activity).url as Link;
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      store,
      vuetify,
      propsData: {
        attachments: [link],
      },
    });

    expect(wrapper.findAll("attachmentsimplelink-stub").length).toBe(1);
  });

  it("Attachment is empty", () => {
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      store,
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
      store,
      vuetify,
      propsData: {
        attachments: undefined,
      },
    });

    expect(wrapper.findAll("v-col-stub").length).toBe(0);
  });

  it("Attachment without mediaType", async () => {
    const object = articles[2].object as ActivityObject;
    const attachments = [object.attachment as Link];
    const wrapper = shallowMount(ActivityStreamsAttachments, {
      localVue,
      store,
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
});
