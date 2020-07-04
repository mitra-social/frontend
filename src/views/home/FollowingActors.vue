<template>
  <div class="follower-container">
    <v-list>
      <v-list-item-group color="primary" no-action>
        <v-list-item class="action-all" inactive>
          <v-list-item-content>
            <v-list-item-title>Action for all:</v-list-item-title>
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
              id="remove-exclude-actor-btn"
              class="following-btn"
              icon
              @click="toggleExcludeActor(false)"
              :disabled="excludeActorLength === 0"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              id="add-exclude-actor-btn"
              class="following-btn"
              icon
              @click="toggleExcludeActor(true)"
              :disabled="excludeActorLength === getFollowing.length"
            >
              <v-icon>mdi-eye-off</v-icon>
            </v-btn>
            <v-btn
              id="add-exclude-actor-btn"
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
          :actor="{ name: 'all', icon: 'assets/mitra-logo-white.png' }"
        />
        <FollowingActor
          v-for="(following, index) in getFollowing"
          :key="index"
          :following="following"
        />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import FollowingActor from "@/components/following/FollowingActor.vue";
import { Following } from "@/model/following";
import { ActivityObjectHelper } from "../../utils/activity-object-helper";
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
  public getFollowing!: Array<Following>;

  @collectionStore.Getter
  public excludeActorLength!: number;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;

  @collectionStore.Action
  public addExcludeActor!: (actorId: string) => void;

  @collectionStore.Action
  public removeActorFromExclude!: (actorId: string) => void;

  private toggleExcludeActor(isAdd: boolean): void {
    this.getFollowing.forEach((following) => {
      const id = ActivityObjectHelper.extractId(following.actor);

      if (!id) {
        return;
      }

      if (isAdd) {
        this.addExcludeActor(id);
        following.show = false;
        return;
      }

      this.removeActorFromExclude(id);
      following.show = true;
    });
  }
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
