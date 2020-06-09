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
    confirmPassword: pwd,
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    if (router.currentRoute.path !== "/signup") {
      router.push({ name: "signup" });
    }
  });

  it("User sign up is successful", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    wrapper.setData(data);

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(router.currentRoute.path).toBe("/login");
  });

  it("Value for field `username` is empty", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="user"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Value for field `username` is too short", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find('input[name="user"]').setValue("john");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe(
      "This value is too short. It should have 5 characters or more."
    );
  });

  it("User exists", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find('input[name="user"]').setValue("john.doe");

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(wrapper.find(".v-alert__content").text()).toBe("User already exists!");
  });

  it("Email is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="email"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Value for field `email` is not valid 1", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="email"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("johnny.test");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe(
      "E-mail must be valid."
    );
  });

  it("Value for field `email` is not valid 2", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="email"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("johnny.test@mail");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe(
      "E-mail must be valid."
    );
  });

  it("Email address is already taken", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });

    wrapper.setData(data);

    await flushPromises();
    wrapper.find('input[name="email"]').setValue("john.doe@mail.com");

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(wrapper.find(".v-alert__content").text()).toBe("This e-mail is already linked to an user.");
  });

  it("Password is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="password"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Confirm password is required", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="confirmPassword"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe("Required.");
  });

  it("Confirmation password is not the same as the password", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="confirmPassword"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("notEqual");

    await flushPromises();
    wrapper.find("form").trigger("submit.prevent");

    await flushPromises();
    expect(wrapper.find(".v-messages__message").text()).toBe(
      "Passwords don't match."
    );
  });

  it("Submit button is disabled if form validation has an error", async () => {
    const wrapper = mount(SignUp, { localVue, vuetify, router, store });
    const input = wrapper.find('input[name="user"]');
    wrapper.setData(data);

    await flushPromises();
    input.setValue("");

    await flushPromises();
    expect(wrapper.find("#submit").attributes("disabled")).toBe("disabled");
  });
});
