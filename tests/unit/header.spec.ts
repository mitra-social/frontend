import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, shallowMount } from "@vue/test-utils";

import Header from "@/components/layout/MitraHeader.vue";
import store from "@/store";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Header.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Is mitra logo set", () => {
    const wrapper = shallowMount(Header, { localVue, vuetify, store });
    expect(wrapper.find(".header-logo").attributes("src")).toBe(
      "@/assets/mitra-logo-white.png"
    );
  });

  // test('renders correctly', async done => {
  //   const wrapper = shallowMount(Header, { localVue, vuetify, store });
  //   expect(wrapper.element).toMatchSnapshot()
  // })
});
