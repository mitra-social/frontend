import {
  Activity,
  ActivityObject,
  Link,
  OrderedCollectionPage,
} from "activitypub-objects";
import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount } from "@vue/test-utils";

import collection from "@/api-client/mock/data/collection-page-1.json";
import AttachmentDialog from "@/components/attachment/AttachmentDialog.vue";
import { Attachment } from "@/model/attachment";
import "@/plugins/global-directives";
import store from "@/store";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/components/attachment/AttachmentDialog.vue", () => {
  let articles: Activity[];
  const attachments: Map<number, Attachment[]> = new Map();
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    articles = (collection as OrderedCollectionPage)
      .orderedItems as ActivityObject[];

    const object0 = articles[0].object as ActivityObject;
    const link0 = object0.attachment as Link;
    attachments.set(0, [
      {
        type: link0.mediaType,
        title: link0.name,
        url: link0.href.toString(),
        width: link0.width,
        height: link0.height,
      },
    ]);

    const object1 = articles[1].object as ActivityObject;
    const link1 = object1.attachment as Link[];
    attachments.set(1, [
      {
        type: link1[0].mediaType,
        title: link1[0].name,
        url: link1[0].href.toString(),
        width: link1[0].width,
        height: link1[0].height,
      },
      {
        type: link1[1].mediaType,
        title: link1[1].name,
        url: link1[1].href.toString(),
        width: link1[1].width,
        height: link1[1].height,
      },
    ]);

    store.state.DialogAttachments.attachments = attachments;
    vuetify = new Vuetify();
  });

  it("Check carousel height", async () => {
    store.state.DialogAttachments.indexSelectedAttachments = 1;

    const wrapper = shallowMount(AttachmentDialog, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();

    expect(wrapper.find("v-carousel-stub").attributes("height")).toBe("690px");
  });

  it("Attachment image is correct rendering", () => {
    store.state.DialogAttachments.indexSelectedAttachments = 0;

    const wrapper = shallowMount(AttachmentDialog, {
      localVue,
      store,
      vuetify,
    });

    expect(wrapper.find("v-img-stub").attributes("alt")).toBe(
      "A wolf dressed up as a legend of the 5 rings lion clan shogun"
    );
    expect(wrapper.find("v-img-stub").attributes("lazysrc")).toBe(
      "https://picsum.photos/200"
    );
    expect(wrapper.find("v-img-stub").attributes("src")).toBe(
      "https://picsum.photos/200"
    );
  });

  it("Attachment has one image", () => {
    store.state.DialogAttachments.indexSelectedAttachments = 0;

    const wrapper = shallowMount(AttachmentDialog, {
      localVue,
      store,
      vuetify,
    });

    expect(wrapper.findAll("v-img-stub").length).toBe(1);
    expect(wrapper.find("v-carousel-stub").attributes("hidedelimiters")).toBe(
      "true"
    );
  });

  it("Attachment has more then one image", () => {
    store.state.DialogAttachments.indexSelectedAttachments = 1;

    const wrapper = shallowMount(AttachmentDialog, {
      localVue,
      store,
      vuetify,
    });

    expect(wrapper.findAll("v-img-stub").length).toBe(2);
    expect(wrapper.find("v-carousel-stub").attributes("showarrows")).toBe(
      "true"
    );
  });
});
