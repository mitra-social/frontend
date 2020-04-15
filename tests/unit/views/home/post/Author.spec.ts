import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

import Author from "@/views/home/post/Author.vue";
import collection from "@/api/mock/data/collection.json";
import { Article } from "activitypub-objects";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Author.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  // eslint-disable-next-line
  let languageGetter: any;
  let articles: Article[];

  beforeEach(() => {
    vuetify = new Vuetify();
    articles = collection.orderedItems as Article[];
    languageGetter = jest.spyOn(window.navigator, "language", "get");
  });

  it("Author has name", () => {
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[0].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).author).toBe("Sally");
  });

  it("Author has language map german", () => {
    languageGetter.mockReturnValue("de");
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[2].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).author).toBe("Hans");
  });

  it("Author has language map english", () => {
    languageGetter.mockReturnValue("en");
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[2].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).author).toBe("John");
  });

  it("Author has language map english", () => {
    languageGetter.mockReturnValue("fr");
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[2].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).author).toBe("Jean");
  });

  it("Author has no name", () => {
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[1].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).author).toBeUndefined();
  });

  it("Author has icon url", () => {
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[0].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).icon).toBe(
      "https://i.picsum.photos/id/1062/5092/3395.jpg"
    );
  });

  it("Author has no icon url", () => {
    const wrapper = mount(Author, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: articles[1].attributedTo
      }
    });
    // eslint-disable-next-line
    expect((wrapper.vm as any).icon).toBeUndefined();
  });
});
