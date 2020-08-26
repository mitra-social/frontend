import flushPromises from "flush-promises";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";

import apiService from "@/api-client/mock/index";
import { ApiClientMocke } from "@/api-client/mock/api-client-mock";
import router from "@/router";
import "@/plugins/date-fns";
import store from "@/store";
import { AuthenticationUtil } from "@/utils/authentication-util";
import Profile from "@/views/settings/Profile.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/settings/Password.vue", () => {
  const newPassword = "newPassword";
  const apiServiceMock = apiService as ApiClientMocke;
  const userName = "john.doe";
  const data = {
    password: "123",
    newPassword: newPassword,
    confirmPassword: newPassword,
  };
  // eslint-disable-next-line
  let vuetify: any;

  beforeEach(async () => {
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(userName);
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    await flushPromises();
    store.dispatch("User/fetchUser", { root: true });
    await flushPromises();
  });

  afterEach(async () => {
    const jestReset = apiServiceMock.getJestReset();
    jestReset();
    await flushPromises();
  });

  it("Check preferredUsername", async () => {
    const wrapper = shallowMount(Profile, { localVue, store, vuetify });
    await flushPromises();

    expect(wrapper.findAll("v-text-field-stub").at(0).attributes("name")).toBe(
      "preferredUsername"
    );
    expect(wrapper.findAll("v-text-field-stub").at(0).attributes("value")).toBe(
      userName
    );
  });

  it("Update email address", async (done) => {
    const wrapper = mount(Profile, { localVue, store, vuetify });
    const newEmail = "new@mail.org";
    expect(store.state.User.user.email).toBe("john.doe@example.org");

    const input = wrapper.find('input[name="email"]');
    input.setValue(newEmail);
    await flushPromises();
    const password = wrapper.find('input[name="password"]');
    password.setValue("123");
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick().then(() => {
      expect(store.state.User.user.email).toBe(newEmail);
      done();
    });
  });

  it("Email must be valid", async () => {
    const wrapper = mount(Profile, { localVue, store, vuetify });
    const input = wrapper.find('input[name="email"]');
    input.setValue("new@mail");
    await flushPromises();

    expect(
      wrapper
        .findAll(".v-input__control")
        .at(1)
        .find(".v-messages__message")
        .text()
    ).toBe("E-mail must be valid.");
  });

  it("Check registered at value", async () => {
    const wrapper = shallowMount(Profile, { localVue, store, vuetify });
    await flushPromises();

    expect(wrapper.findAll("v-text-field-stub").at(2).attributes("name")).toBe(
      "registered_at"
    );
    expect(wrapper.findAll("v-text-field-stub").at(2).attributes("value")).toBe(
      "04.08.2020 08:58"
    );
  });

  it("Check updated at value", async () => {
    const updateDateTime = "2020-04-28T17:49:12Z";
    store.state.User.user.updated = updateDateTime;
    await flushPromises();

    const wrapper = shallowMount(Profile, { localVue, store, vuetify });
    await flushPromises();

    expect(wrapper.findAll("v-text-field-stub").at(3).attributes("name")).toBe(
      "updated_at"
    );
    expect(wrapper.findAll("v-text-field-stub").at(3).attributes("value")).toBe(
      "04.28.2020 07:49"
    );
  });

  it("Update summary", async () => {
    const summaryText = "Summary test";
    store.state.User.user.summary = summaryText;
    await flushPromises();
    await flushPromises();

    const wrapper = shallowMount(Profile, { localVue, store, vuetify });
    await flushPromises();

    expect(wrapper.findAll("v-textarea-stub").at(0).attributes("name")).toBe(
      "summary"
    );
    expect(wrapper.findAll("v-textarea-stub").at(0).attributes("value")).toBe(
      summaryText
    );
  });

  it("Change password success", async () => {
    const wrapper = mount(Profile, { localVue, router, store, vuetify });
    wrapper.setData(data);
    await flushPromises();

    wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(apiServiceMock.getPassword()).toBe(newPassword);
  });

  it("Password is required", async () => {
    const wrapper = mount(Profile, { localVue, router, store, vuetify });
    wrapper.setData(data);
    await flushPromises();

    wrapper.find('input[name="password"]').setValue("");
    await flushPromises();

    expect(
      wrapper
        .findAll(".v-input__control")
        .at(7)
        .find(".v-messages__message")
        .text()
    ).toBe("Required.");
  });

  it("Show password in clear text", async () => {
    const wrapper = mount(Profile, { localVue, router, store, vuetify });
    wrapper.setData(data);

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "password"
    );

    wrapper.findAll(".mdi-eye-off").at(2).find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "text"
    );
  });

  it("Change password in clear text to hidden password field", async () => {
    const wrapper = mount(Profile, { localVue, router, store, vuetify });
    wrapper.setData(data);
    wrapper.setData({ showPassword: true });
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "text"
    );

    wrapper.find(".mdi-eye").find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "password"
    );
  });

  it("Close password dialog window", async () => {
    const wrapper = mount(Profile, { localVue, store, vuetify });

    store.state.Dialog.isOpen = true;
    expect(store.state.Dialog.isOpen).toBeTruthy();
    wrapper.find("#close-btn").trigger("click");

    await flushPromises();
    expect(store.state.Dialog.isOpen).toBeFalsy();
  });
});
