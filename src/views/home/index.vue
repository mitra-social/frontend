<template>
  <div class="content" no-gutters>
    <div class="following-actors" v-if="isFollowingLoading">
      <FollowingActors />
    </div>
    <div class="posts" v-if="isFollowingLoading">
      <Posts />
    </div>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list>
        <v-list-item class="px-2">
          <v-avatar id="user-icon" color="indigo" v-if="getUser.icon">
            <v-img :src="getUser.icon"></v-img>
          </v-avatar>
          <v-avatar id="user-icon-placeholder" color="indigo" size="36" v-else>
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar>
          <v-list-item-content>
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

      <v-list dense>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon v-if="$vuetify.theme.dark">mdi-moon-waning-crescent</v-icon>
            <v-icon v-else>mdi-white-balance-sunny</v-icon>
          </v-list-item-icon>

          <v-list-item-action>
            <v-switch
              v-model="$vuetify.theme.dark"
              hide-details
              inset
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          link
          @click="toggleDialog({ title: 'Profile', component: 'Profile' })"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          @click="toggleDialog({ title: 'Password', component: 'Password' })"
        >
          <v-list-item-icon>
            <v-icon>mdi-key-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Password</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item class="px-2" @click="logout()">
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
import { User } from "@/model/user";
import { DialogSettings } from "@/model/dialog-settings";
import { AuthenticationUtil } from "@/utils/authentication-util";

const dialogStore = namespace("Dialog");
const userStore = namespace("User");
const followingStore = namespace("Following");

@Component({
  components: {
    FollowingActors,
    Posts,
  },
})
export default class MitraHome extends Vue {
  private isFollowingLoading = false;
  private drawer = true;
  private mini = true;

  @userStore.Getter
  public getUser!: User;

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @followingStore.Action
  public fetchFollowing!: (user: string) => Promise<void>;

  private created() {
    if (this.getUser) {
      this.fetchFollowing(this.getUser.preferredUsername).then(() => {
        this.isFollowingLoading = true;
      });
    }
  }

  public logout(): void {
    AuthenticationUtil.clear();
    this.$router.push({ name: "login" });
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
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
  min-height: 100%;
}
</style>
