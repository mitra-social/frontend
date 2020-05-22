import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import store from "@/store";
import router from "@/router";
import SignUp from "@/views/SignUp.vue";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("SignUp.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  const pwd = "test1234";
  const data = {
    user: "johnny.test",
    email: "johnny.test@mail.at",
    password: pwd,
    confirmPassword: pwd
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    if (router.currentRoute.path !== "/signup") {
      router.push({ name: "signup" });
    }
  });

  it("SignUp success", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    wrapper.setData(data);

    await flushPromises();
    const button = wrapper.find("#submit");
    button.trigger("click");

    await flushPromises();
    expect(router.currentRoute.path).toBe("/login");
  });

  it("User is empty", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"user\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("User is too short", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find("input[name=\"user\"]").setValue("john");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("This value is too short. It should have 5 characters or more.");
  });

  it("User exists", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find("input[name=\"user\"]").setValue("john.doe");

    await flushPromises();
    const button = wrapper.find("#submit");
    button.trigger("click");

    await flushPromises();
    expect(wrapper.find(".v-alert__content").text()).toBe("User exists!");
  });

  it("Email is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"email\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Email is not valid 1", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"email\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("johnny.test");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("E-mail must be valid.");
  });

  it("Email is not valid 2", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"email\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("johnny.test@mail");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("E-mail must be valid.");
  });

  it("Email exists", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find("input[name=\"email\"]").setValue("john.doe@mail.com");

    await flushPromises();
    const button = wrapper.find("#submit");
    button.trigger("click");

    await flushPromises();
    expect(wrapper.find(".v-alert__content").text()).toBe("Email exists!");
  });

  it("Password is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"password\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Password has no letter", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"password\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("12345678");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Your password must contain at least one letter.");
  });

  it("Password has no number", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"password\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("password");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Your password must contain at least one digit.");
  });


  it("Confirm password is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"confirmPassword\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Confirmation password is not the same as the password", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"confirmPassword\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("notEqual");

    await flushPromises();
    const button = wrapper.find("#submit");
    button.trigger("click");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Doesn't match Password.");
  });

  it("Submit button is disabled when form validation has a error", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find("input[name=\"user\"]");
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find("#submit").attributes("disabled")).toBe("disabled");
  });

});
