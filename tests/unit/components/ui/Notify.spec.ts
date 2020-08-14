import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import Notify from "@/components/ui/Notify.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Notify.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  afterEach(() => {
    store.state.Notify.notification = undefined;
  });

  it("Snackbar has error message", async (done) => {
    const msg = "Notify error message";
    const wrapper = mount(Notify, { localVue, vuetify, router, store });
    wrapper.vm.$store.dispatch("Notify/error", msg, { root: true });
    await flushPromises();

    flushPromises().then(() => {
      expect(wrapper.find(".v-snack__content").text()).toBe(msg);
      expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
        "error"
      );
      done();
    });
  });

  it("Snackbar has warning message", async (done) => {
    const msg = "Notify warning message";
    const wrapper = mount(Notify, { localVue, vuetify, router, store });
    wrapper.vm.$store.dispatch("Notify/warning", msg, { root: true });
    await flushPromises();
    flushPromises().then(() => {
      expect(wrapper.find(".v-snack__content").text()).toBe(msg);
      expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
        "warning"
      );
      done();
    });
  });

  it("Snackbar has success message", async (done) => {
    const msg = "Notify success message";
    const wrapper = mount(Notify, { localVue, vuetify, router, store });
    wrapper.vm.$store.dispatch("Notify/success", msg, { root: true });
    flushPromises().then(() => {
      expect(wrapper.find(".v-snack__content").text()).toBe(msg);
      expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
        "success"
      );
      done();
    });
  });

  it("Snackbar has info message", async (done) => {
    const msg = "Notify info message";
    const wrapper = mount(Notify, { localVue, vuetify, router, store });
    wrapper.vm.$store.dispatch("Notify/info", msg, { root: true });
    flushPromises().then(() => {
      expect(wrapper.find(".v-snack__content").text()).toBe(msg);
      expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
        "info"
      );
      done();
    });
  });
});
