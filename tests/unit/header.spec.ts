import { shallowMount } from "@vue/test-utils";
import Header from "@/components/layout/MitraHeader.vue";

describe("Header.vue", () => {
  it("test title text", () => {
    const wrapper = shallowMount(Header);
    const h2 = wrapper.find("h2").element;
    expect(h2.textContent).toMatch("Header");
  });
});
