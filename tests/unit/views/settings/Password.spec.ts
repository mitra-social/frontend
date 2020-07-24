import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import apiService from "@/api-client/mock/index";
import Password from "@/views/settings/Password.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ApiClientMocke } from "@/api-client/mock/api-client-mock";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("@/views/settings/Password.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const newPassword = "newPassword";
  const apiServiceMock = apiService as ApiClientMocke;

  const data = {
    password: "123",
    newPassword: newPassword,
    confirmPassword: newPassword,
  };

  beforeEach(async () => {
    vuetify = new Vuetify();

    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue("john.doe");
    jest
      .spyOn(AuthenticationUtil, "getToken")
      .mockReturnValue("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi");
    await flushPromises();
  });

  afterEach(async () => {
    apiServiceMock.getJestReset();
  });

  it("Change password success", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    const newPassword = "newPassword";
    wrapper.setData(data);

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(apiServiceMock.getPassword()).toBe(newPassword);
  });

  it("Password is required", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    wrapper.find('input[name="password"]').setValue("");
    await flushPromises();

    expect(
      wrapper
        .findAll(".v-input__control")
        .at(0)
        .find(".v-messages__message")
        .text()
    ).toBe("Required.");
  });

  it("Show password in clear text", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "password"
    );

    wrapper.findAll(".v-input__control").at(0).find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "text"
    );
  });

  it("Change password in clear text to hidden password field", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    wrapper.setData({ showPassword: true });
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "text"
    );

    wrapper.findAll(".v-input__control").at(0).find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="password"]').attributes("type")).toBe(
      "password"
    );
  });

  it("New password is required", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    wrapper.find('input[name="newPassword"]').setValue("");
    await flushPromises();

    expect(
      wrapper
        .findAll(".v-input__control")
        .at(1)
        .find(".v-messages__message")
        .text()
    ).toBe("Required.");
  });

  it("New password is then less 8 characters", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);

    wrapper.find('input[name="newPassword"]').setValue("new");
    await flushPromises();

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(
      wrapper
        .findAll(".v-input__control")
        .at(1)
        .find(".v-messages__message")
        .text()
    ).toBe("Min 8 characters.");
  });

  it("Show new password in clear text", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    expect(wrapper.find('input[name="newPassword"]').attributes("type")).toBe(
      "password"
    );

    wrapper.findAll(".v-input__control").at(1).find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="newPassword"]').attributes("type")).toBe(
      "text"
    );
  });

  it("Change new password in clear text to hidden password field", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    wrapper.setData({ showNewPassword: true });
    await flushPromises();

    expect(wrapper.find('input[name="newPassword"]').attributes("type")).toBe(
      "text"
    );

    wrapper.findAll(".v-input__control").at(1).find("button").trigger("click");
    await flushPromises();

    expect(wrapper.find('input[name="newPassword"]').attributes("type")).toBe(
      "password"
    );
  });

  it("Confirm password is required", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    wrapper.find('input[name="confirmPassword"]').setValue("");
    await flushPromises();

    expect(
      wrapper
        .findAll(".v-input__control")
        .at(2)
        .find(".v-messages__message")
        .text()
    ).toBe("Required.");
  });

  it("New password not match with confirm password", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);

    wrapper.find('input[name="confirmPassword"]').setValue("confirmPassword");
    await flushPromises();

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(
      wrapper
        .findAll(".v-input__control")
        .at(2)
        .find(".v-messages__message")
        .text()
    ).toBe("Passwords don't match.");
  });

  it("Show confirm password in clear text", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    await flushPromises();

    expect(
      wrapper.find('input[name="confirmPassword"]').attributes("type")
    ).toBe("password");

    wrapper.findAll(".v-input__control").at(2).find("button").trigger("click");
    await flushPromises();

    expect(
      wrapper.find('input[name="confirmPassword"]').attributes("type")
    ).toBe("text");
  });

  it("Change confirm password in clear text to hidden password field", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    wrapper.setData(data);
    wrapper.setData({ showConfirmPassword: true });
    await flushPromises();

    expect(
      wrapper.find('input[name="confirmPassword"]').attributes("type")
    ).toBe("text");

    wrapper.findAll(".v-input__control").at(2).find("button").trigger("click");
    await flushPromises();

    expect(
      wrapper.find('input[name="confirmPassword"]').attributes("type")
    ).toBe("password");
  });

  it("Close password dialog window", async () => {
    const wrapper = mount(Password, { localVue, vuetify, router, store });
    store.state.Dialog.isOpen = true;
    expect(store.state.Dialog.isOpen).toBeTruthy();
    wrapper.find("#close-btn").trigger("click");

    await flushPromises();
    expect(store.state.Dialog.isOpen).toBeFalsy();
  });
});
