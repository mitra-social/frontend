import {
  ActivityObject,
  Activity,
  OrderedCollectionPage,
  Link,
} from "activitypub-objects";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import "@/plugins/global-directives";
import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentImage from "@/views/home/post/attachments/AttachmentImage.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/home/post/attachments/AttachmentImage.vue", () => {
  let articles: Activity[];
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];
    vuetify = new Vuetify();
  });

  it("Image is rendering", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: link.name,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.findAll(".v-image").length).toBe(1);
  });

  it("Check image url is correct", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: link.name,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image__image").attributes("style")).toContain(
      "background-image: url(https://picsum.photos/200)"
    );
  });

  it("Attachment has no url", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: link.name,
          type: link.mediaType,
          url: undefined,
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image").exists()).toBe(false);
  });

  it("Attachment has name and this set as alternative text for image", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: link.name,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image").attributes("aria-label")).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
  });

  it("Attachment has no name and set default alternative text for image", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: undefined,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image").attributes("aria-label")).toContain(
      "Attachment image"
    );
  });

  it("Is a single image attachment", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: undefined,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: true,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image").element.classList).toContain(
      "single-attach"
    );
  });

  it("Is a image in array of attachments", () => {
    const object = articles[0].object as ActivityObject;
    const link = object.attachment as Link;
    const wrapper = mount(AttachmentImage, {
      localVue,
      propsData: {
        attach: {
          height: link.height,
          title: link.name,
          type: link.mediaType,
          url: link.href.toString(),
          width: link.width,
        },
        attachIndex: 0,
        isSingle: false,
        postIndex: 0,
      },
      vuetify,
    });

    expect(wrapper.find(".v-image").element.classList).toContain("mx-sm-auto");
  });
});
