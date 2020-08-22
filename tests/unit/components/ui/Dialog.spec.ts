import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import Dialog from "@/components/ui/Dialog.vue";
import DialogTestComponent from "./DialogTestComponent.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/components/ui/Dialog.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const dialogTitle = "Dialog title test";
  const stubs = {
    DialogTestComponent,
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    document.body.setAttribute("data-app", "true");
  });

  afterEach(() => {
    store.state.Dialog.isOpen = false;
    store.state.Dialog.title = undefined;
    store.state.Dialog.component = undefined;
  });

  it("Open dialog window with test component", () => {
    store.state.Dialog.isOpen = true;
    store.state.Dialog.component = "DialogTestComponent";

    const wrapper = mount(Dialog, {
      localVue,
      vuetify,
      router,
      store,
      stubs,
    });
    expect(wrapper.find(".v-dialog__content").exists()).toBeTruthy();
  });

  it("Open dialog window with test component", () => {
    store.state.Dialog.isOpen = true;
    store.state.Dialog.component = "DialogTestComponent";
    store.state.Dialog.title = dialogTitle;

    const wrapper = mount(Dialog, {
      localVue,
      vuetify,
      router,
      store,
      stubs,
    });
    expect(wrapper.find(".v-card__title").exists()).toBeTruthy();
    expect(wrapper.find(".v-card__title").text()).toBe(dialogTitle);
  });

  it("Close dialog window from store state", async () => {
    store.state.Dialog.isOpen = true;
    store.state.Dialog.component = "DialogTestComponent";

    const wrapper = mount(Dialog, {
      localVue,
      vuetify,
      router,
      store,
      stubs,
    });
    expect(wrapper.find(".v-dialog__content").exists()).toBeTruthy();

    store.state.Dialog.isOpen = false;
    await flushPromises();

    expect(wrapper.find(".v-dialog__content").exists()).toBeFalsy();
  });

  it("Close dialog window by button", async () => {
    store.state.Dialog.isOpen = true;
    store.state.Dialog.component = "DialogTestComponent";

    const wrapper = mount(Dialog, {
      localVue,
      vuetify,
      router,
      store,
      stubs,
    });
    expect(wrapper.find(".v-dialog__content").exists()).toBeTruthy();

    wrapper.find(".v-btn").trigger("click");
    await flushPromises();

    expect(wrapper.find(".v-dialog__content").exists()).toBeFalsy();
  });
});
