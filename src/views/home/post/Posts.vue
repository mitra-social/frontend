<template>
  <div class="post-container" v-if="getPosts">
    <div v-if="getPosts.length > 0">
      <div v-for="(post, index) in getPosts" :key="index">
        <v-card class="post">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline">{{
                post.name ? post.name : post.summary | stripHtmlTags
              }}</v-list-item-title>
              <v-list-item-subtitle>
                <div class="d-flex flex-row justify-space-between">
                  <Date
                    v-if="post.published"
                    icon="mdi-publish"
                    :date="post.published"
                  />
                  <Date
                    v-if="post.updated"
                    icon="mdi-update"
                    :date="post.updated"
                  />
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <component :is="getComponent(post.type)" :data="post" />
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
            <ActorPin v-if="post.attributedTo" :actor="post.attributedTo" />
            <v-spacer></v-spacer>
            <v-btn icon disabled> <v-icon>mdi-comment-outline</v-icon> </v-btn>
            <v-btn icon disabled>
              <v-icon>mdi-heart-circle-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div v-else>
      <v-card class="post">
        <v-card-title>
          <v-icon class="search-user-icon">mdi-account-search-outline</v-icon>
        </v-card-title>
        <v-card-text>
          You haven't got any posts yet because you're not following anyone yet.
          Look for someone you can follow and enjoy reading.
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
import { namespace } from "vuex-class";
import { ActivityObject, Link } from "activitypub-objects";
import striptags from "striptags";

import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";
import ActorPin from "@/components/actor/ActorPin.vue";
import Date from "@/components/ui/Date.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";

const collectionStore = namespace("Collection");
const notifyStore = namespace("Notify");

@Component({
  components: {
    ActorPin,
    Date,
    ActivityStreamsArticleType,
    ActivityStreamsNoteType,
  },
  filters: {
    stripHtmlTags(value: string) {
      return striptags(value);
    },
  },
})
export default class MitraPosts extends Vue {
  @collectionStore.Getter
  public getPosts!: Array<ActivityObject | Link>;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;

  @notifyStore.Action
  public error!: (message: string) => void;

  private created() {
    this.initGetUser();
  }

  private initGetUser() {
    const user = AuthenticationUtil.getUser();

    if (user) {
      this.fetchCollection(user).catch(() => {
        this.notAllowedUser();
      });
    } else {
      this.notAllowedUser();
    }
  }

  private getComponent(type: string) {
    return PostTypes[type as keyof typeof PostTypes];
  }

  private notAllowedUser() {
    AuthenticationUtil.clear();
    router.push("/login");
    this.error("Authentication is incorrect");
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}

.post {
  margin: 5px;
}

.search-user-icon.v-icon.v-icon {
  margin: auto;
  font-size: 100px;
}

.v-card__text {
  width: inherit;
}
</style>
