<template>
  <div class="follower-container">
    <v-list>
      <v-list-item-group color="primary" no-action>
        <v-list-item class="action-all" inactive>
          <v-list-item-content>
            <v-list-item-title>Action:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="d-flex flex-row align-center">
            <v-btn
              id="refresh-btn"
              class="following-btn"
              icon
              @click="fetchCollection(getUser.preferredUsername)"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
            <v-btn
              class="following-btn"
              icon
              @click="
                toggleDialog({ title: 'Find User', component: 'SearchActor' })
              "
            >
              <v-icon>mdi-account-plus-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <FollowingActor
          v-for="(actor, index) in getFollowing"
          :key="index"
          :actor="actor"
        />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import FollowingActor from "@/components/following/FollowingActor.vue";
import { User } from "../../model/user";
import { DialogSettings } from "../../model/dialog-settings";

const userStore = namespace("User");
const followingStore = namespace("Following");
const collectionStore = namespace("Collection");
const dialogStore = namespace("Dialog");

@Component({
  components: {
    FollowingActor,
  },
})
export default class FollowingActors extends Vue {
  private title = "Following";

  @userStore.Getter
  public getUser!: User;

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @followingStore.Getter
  public getFollowing!: User[];

  @collectionStore.Getter
  public excludeActorLength!: number;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;
}
</script>

<style lang="scss" scoped>
.follower-container {
  height: 100%;
  overflow: scroll;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}

.action-all {
  padding-left: 32px;
}
</style>
