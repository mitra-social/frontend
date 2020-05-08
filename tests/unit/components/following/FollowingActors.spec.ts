import Vue from "vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { ActivityObject, Link } from "activitypub-objects";

import FollowingActors from "@/views/home/FollowingActors.vue";
import collection from "@/api-client/mock/data/following.json";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("FollowingActors.vue", () => {
  // eslint-disable-next-line
  let vuetify: any;
  let followingActors: Array<ActivityObject | Link>;

  beforeEach(() => {
    vuetify = new Vuetify();
    followingActors = collection.orderedItems as Array<ActivityObject | Link>;
  });

  it("renders all following users as list items", () => {
    const wrapper = mount(FollowingActors, {
      localVue,
      vuetify,
      propsData: {
        getFollowing: followingActors
      }
    });

    const listItems = wrapper.findAll(".following-actors .v-list-ote");
    expect(listItems.length).toBe(2);
  });
});
