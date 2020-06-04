import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { Activity } from "activitypub-objects";

import ActorPin from "@/components/actor/ActorPin.vue";
import collection from "@/api-client/mock/data/collection.json";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("ActorPin.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let activities: Array<Activity>;

  beforeEach(() => {
    vuetify = new Vuetify();
    activities = collection.orderedItems as Array<Activity>;
  });

  it("Actor is an object with name property", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        actor: activities[0].actor,
      },
    });

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe("Sally");
  });

  it("Actor is a object with nameMap property", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        actor: activities[2].actor,
      },
    });

    const lang: string = navigator.language.substr(0, 2);
    const names: { [index: string]: string } = {
      de: "Hans",
      en: "John",
      fr: "Jean",
    };

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe(names[lang]);
  });

  it("Actor has an icon property as an image", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        actor: activities[0].actor,
      },
    });

    expect(wrapper.find(".v-icon").exists()).toBe(false);
    expect(wrapper.find(".v-image").exists()).toBe(true);
  });

  it("Actor has no icon property and set default icon", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        actor: activities[1].actor,
      },
    });

    expect(wrapper.find(".v-icon").exists()).toBe(true);
    expect(wrapper.find(".v-image").exists()).toBe(false);
  });

  it("Actor is an url", () => {
    const wrapper = mount(ActorPin, {
      localVue,
      vuetify,
      propsData: {
        actor: activities[1].actor,
      },
    });

    const content = wrapper.find(".v-menu").find("div");
    expect(content.text()).toBe("http://johnny.example.org");
  });
});
