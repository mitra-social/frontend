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
    vuetify = new Vuetify();
    articles = collection.orderedItems as Activity[];
  });

  it("Image is rendering", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
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
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.findAll(".v-image").length).toBe(1);
  });

  it("Check image url is correct", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
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
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.find(".v-image__image").attributes("style")).toContain(
      "background-image: url(https://picsum.photos/200)"
    );
  });

  it("Attachment has no url", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: link.name,
          url: undefined,
          width: link.width,
          height: link.height,
        },
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.find(".v-image").exists()).toBe(false);
  });

  it("Attachment has name and this set as alternative text for image", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
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
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.find(".v-image").attributes("aria-label")).toBe(
      "Minecraft Signs"
    );
  });

  it("Attachment has no name and set default alternative text for image", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: undefined,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.find(".v-image").attributes("aria-label")).toContain(
      "Attachment image"
    );
  });

  it("Is a single image attachment", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      vuetify,
      propsData: {
        attach: {
          type: link.mediaType,
          title: undefined,
          url: link.href.toString(),
          width: link.width,
          height: link.height,
        },
        postIndex: 0,
        attachIndex: 0,
        isSingle: true,
      },
    });

    expect(wrapper.find(".v-image").element.classList).toContain(
      "single-attach"
    );
  });

  it("Is a image in array of attachments", async () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
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
        postIndex: 0,
        attachIndex: 0,
        isSingle: false,
      },
    });

    expect(wrapper.find(".v-image").element.classList).toContain("mx-sm-auto");
  });
});
