<template>
  <v-container fluid>
    <v-text-field
      v-model="search"
      flat
      solo-inverted
      hide-details
      append-outer-icon="mdi-magnify"
      label="Search Actor"
      :loading="loadSearchState"
      @click:append-outer="searchActor"
      @keyup.enter="searchActor"
    ></v-text-field>
    <v-list v-if="actors.length > 0">
      <v-list-item-group color="primary">
        <v-list-item v-for="(actor, index) in actors" :key="index">
          <v-list-item-content>
            <SummarizedActor :actor="actor" />
            <v-divider></v-divider>
            <div class="d-flex flex-row">
              <v-btn
                class="ma-2"
                :outlined="!isFollowingActive"
                light
                @click="loadActors(actor.followingIds, true, false)"
                ><v-icon left>mdi-account</v-icon
                >{{ actor.followingCount }} Follows</v-btn
              >
              <v-btn
                class="ma-2"
                :outlined="!isFollowerActive"
                dark
                @click="loadActors(actor.followersIds, false, true)"
                ><v-icon left>mdi-account</v-icon
                >{{ actor.followerCount }} Followers</v-btn
              >
            </div>
            <v-list v-if="actors.length > 0">
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(fof, index) in followersOrFollowing"
                  :key="index"
                >
                  <v-list-item-avatar v-if="icon">
                    <v-img :src="getIcon(fof)"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-avatar v-else>
                    <v-icon>mdi-account-circle</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ getName(fof) }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <!-- <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    {{ actor.followingCount }}
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    {{ actor.followerCount }}
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items> -->
            <!-- <div class="d-flex flex-row space-between">
              <div>Follows: {{ actor.followingCount }}</div>
              <div>Followers: {{ actor.followerCount }}</div>
            </div> -->
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import client from "apiClient";
import FollowingActor from "@/components/following/FollowingActor.vue";
import SummarizedActor from "@/components/actor/ActorSummarized.vue";
import { Actor } from "activitypub-objects";
import { ActorExtended } from "../../store/modules/actor-extended";
import { ActivityObjectHelper } from "../../utils/activity-object-helper";

@Component({
  components: {
    FollowingActor,
    SummarizedActor,
  },
})
export default class SearchActor extends Vue {
  private actors: ActorExtended[] = [];
  private search = "";
  private loadSearchState = false;
  private tab = "";
  private followersOrFollowing: Actor[] = [];
  private isFollowingActive = false;
  private isFollowerActive = false;

  public searchActor() {
    this.loadSearchState = true;

    client
      .findActor(this.search)
      .then((actor) => {
        this.actors = [];
        if (actor) {
          console.log(actor);
          this.actors.push(actor);
        }
      })
      .catch(() => {
        return;
      })
      .finally(() => {
        this.loadSearchState = false;
      });
  }

  public loadActors(
    actorIds: string[],
    isFollowingActive: boolean,
    isFollowerActive: boolean
  ) {
    Promise.all(actorIds.map(client.getActor))
      .then((followersOrFollowing) => {
        this.isFollowingActive = isFollowingActive;
        this.isFollowerActive = isFollowerActive;
        this.followersOrFollowing = followersOrFollowing;
        console.log(followersOrFollowing);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getName(actor: Actor): string | undefined {
    if (actor) {
      return ActivityObjectHelper.extractActorName(actor);
    }
  }

  public getIcon(actor: Actor): string | undefined {
    if (actor) {
      const originalIconUri = ActivityObjectHelper.extractIcon(actor);

      return client.getMedia(originalIconUri);
    }
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
