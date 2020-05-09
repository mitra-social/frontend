import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { ActivityObject, Link, Article } from "activitypub-objects";

import ActorPin from "@/components/actor/ActorPin.vue";
import collection from "@/api-client/mock/data/collection.json";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActorPin.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let articles: Array<ActivityObject | Link>;

  beforeEach(() => {
    vuetify = new Vuetify();
    articles = collection.orderedItems as Array<ActivityObject | Link>;
  });

  it("attributedTo is a object with name property", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: (articles[0] as Article).attributedTo
      }
    });

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe("Sally");
  });

  it("attributedTo is a object with nameMap property", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: (articles[2] as Article).attributedTo
      }
    });

    const lang: string = navigator.language.substr(0, 2);
    const names: { [index: string]: string } = {
      de: "Hans",
      en: "John",
      fr: "Jean"
    };

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe(names[lang]);
  });

  it("attributedTo has a icon property as a image", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: (articles[0] as Article).attributedTo
      }
    });

    expect(wrapper.find(".v-icon").exists()).toBe(false);
    expect(wrapper.find(".v-image").exists()).toBe(true);
  });

  it("attributedTo has no icon property and set default icon", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: (articles[1] as Article).attributedTo
      }
    });

    expect(wrapper.find(".v-icon").exists()).toBe(true);
    expect(wrapper.find(".v-image").exists()).toBe(false);
  });

  it("attributedTo is a string", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        attributedTo: (articles[1] as Article).attributedTo
      }
    });

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe("johnny");
  });
});
