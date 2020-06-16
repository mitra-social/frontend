<template>
  <div class="settings-content" no-gutters>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      width="300px"
      permanent
      dark
    >
      <v-list-item class="user-item px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title">{{
            getUser.preferredUsername
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ getUser.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="{ name: item.link }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="px-4 pt-4 setting-items">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { User } from "@/model/user";

const userStore = namespace("User");

@Component
export default class Settings extends Vue {
  private drawer = true;
  private items = [
    {
      title: "Profile",
      icon: "mdi-account-edit-outline",
      link: "settings.profile",
    },
    { title: "Password", icon: "mdi-key-variant", link: "settings.password" },
    {
      title: "Preferences",
      icon: "mdi-cog-outline",
      link: "settings.preferences",
    },
    {
      title: "Follow And Followers",
      icon: "mdi-account-group-outline",
      link: "settings.followerFollowing",
    },
  ];
  private mini = false;

  @userStore.Getter
  public getUser!: User;
}
</script>

<style lang="scss">
body {
  background-color: #333;
}
.settings-content {
  flex: 1 1 auto;
  min-height: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.setting-items {
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.user-item {
  height: 66px;
}
</style>
