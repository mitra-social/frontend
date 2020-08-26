<template>
  <div class="content" no-gutters>
    <div class="following-actors" v-if="isFollowingLoading">
      <FollowingActors />
    </div>
    <div class="posts" v-if="isFollowingLoading">
      <Posts />
    </div>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <!-- user info -->
      <v-list>
        <v-list-item class="px-2">
          <v-avatar id="user-icon" color="indigo" v-if="getUser.icon">
            <v-img :src="getUser.icon"></v-img>
          </v-avatar>
          <v-avatar id="user-icon-placeholder" color="indigo" size="36" v-else>
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
          <v-list-item-content class="ml-2">
            <v-list-item-title id="user-name">{{
              getUser.preferredUsername
            }}</v-list-item-title>
            <v-list-item-subtitle id="user-email" v-if="getUser.email">
              {{ getUser.email }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <!-- dark mode switcher -->
      <v-list dense>
        <v-list-item link>
          <v-list-item-icon id="dark-mode-icon">
            <v-icon v-if="$vuetify.theme.dark">mdi-moon-waning-crescent</v-icon>
            <v-icon v-else>mdi-white-balance-sunny</v-icon>
          </v-list-item-icon>
          <v-list-item-action>
            <v-switch
              id="dark-mode-switcher"
              v-model="$vuetify.theme.dark"
              hide-details
              inset
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <!-- settings -->
      <v-list dense>
        <v-list-item
          class="setting-item"
          link
          @click.stop="
            toggleDialog({ title: setting.title, component: setting.component })
          "
          v-for="(setting, index) in settingsDrawer"
          :key="index"
        >
          <v-list-item-icon>
            <v-icon>{{ setting.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ setting.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <!-- logout -->
      <v-list>
        <v-list-item id="logout-item" class="px-2" @click.stop="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import FollowingActors from "./FollowingActors.vue";
import Posts from "./post/Posts.vue";
import { DialogSettings } from "@/model/dialog-settings";
import { InternalActor } from "@/model/internal-actor";
import { AuthenticationUtil } from "@/utils/authentication-util";

const dialogStore = namespace("Dialog");
const followingStore = namespace("Following");
const userStore = namespace("User");

@Component({
  components: {
    FollowingActors,
    Posts,
  },
})
export default class MitraHome extends Vue {
  /**********************
   * data fields
   **********************/

  public drawer = true;
  public mini = true;
  public isFollowingLoading = false;
  public settingsDrawer = [
    { title: "Profile", component: "Profile", icon: "mdi-account" },
  ];

  /**********************
   * store getters
   **********************/
  @userStore.Getter
  public getUser!: InternalActor;

  /**********************
   * store actions
   **********************/
  @followingStore.Action
  public fetchFollowing!: (user: string) => Promise<void>;

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  /**********************
   * Lifecycle hooks
   **********************/
  private created(): void {
    if (this.getUser) {
      this.fetchFollowing(this.getUser.preferredUsername).then(() => {
        this.isFollowingLoading = true;
      });
    }
  }

  /**********************
   * public functions
   **********************/
  public logout(): void {
    AuthenticationUtil.clear();
    this.$router.push({ name: "Login" });
  }
}
</script>

<style lang="scss">
body {
  background-color: #333;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.following-actors {
  flex: 0 0 30%;
  max-width: 30%;
}

.posts {
  flex: 0 0 30%;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 70%;
  min-height: 100%;
}
</style>
