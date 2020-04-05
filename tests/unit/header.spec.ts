import { shallowMount } from "@vue/test-utils";
import Header from "@/components/layout/MitraHeader.vue";

describe("Header.vue", () => {
  it("test title text", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.find("h2").text()).toMatch("Header");
  });
});
