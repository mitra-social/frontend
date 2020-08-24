import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import Notify from "@/components/ui/Notify.vue";
import store from "@/store";
import router from "@/router";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/components/ui/Notify.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  afterEach(() => {
    store.state.Notify.notification = undefined;
  });

  it("Snackbar has error message", async () => {
    const msg = "Notify error message";
    const wrapper = mount(Notify, { localVue, router, store, vuetify });

    wrapper.vm.$store.dispatch("Notify/error", msg, { root: true });
    await flushPromises();

    expect(wrapper.find(".v-snack__content").text()).toBe(msg);
    expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
      "error"
    );
  });

  it("Snackbar has warning message", async () => {
    const msg = "Notify warning message";
    const wrapper = mount(Notify, { localVue, router, store, vuetify });

    wrapper.vm.$store.dispatch("Notify/warning", msg, { root: true });
    await flushPromises();

    expect(wrapper.find(".v-snack__content").text()).toBe(msg);
    expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
      "warning"
    );
  });

  it("Snackbar has success message", async () => {
    const msg = "Notify success message";
    const wrapper = mount(Notify, { localVue, router, store, vuetify });

    wrapper.vm.$store.dispatch("Notify/success", msg, { root: true });
    await flushPromises();

    expect(wrapper.find(".v-snack__content").text()).toBe(msg);
    expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
      "success"
    );
  });

  it("Snackbar has info message", async () => {
    const msg = "Notify info message";
    const wrapper = mount(Notify, { localVue, router, store, vuetify });

    wrapper.vm.$store.dispatch("Notify/info", msg, { root: true });
    await flushPromises();

    expect(wrapper.find(".v-snack__content").text()).toBe(msg);
    expect(wrapper.find(".v-snack__wrapper").element.classList).toContain(
      "info"
    );
  });
});
