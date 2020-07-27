<template>
  <div class="post-layout">
    <div id="scroll-target" class="post-container" v-if="getPosts">
      <div v-if="getPosts.length > 0">
        <div v-for="(post, index) in getPosts" :key="index">
          <v-card class="post" v-intersect="onIntersect" :data-index="index">
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
              <Attachments
                v-if="
                  post.attachment &&
                  ((Array.isArray(post.attachment) &&
                    post.attachment.length > 0) ||
                    !Array.isArray(post.attachment))
                "
                :attachments="post.attachment"
              />
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-actions>
              <ActorPin v-if="post.attributedTo" :actor="post.attributedTo" />
              <v-spacer></v-spacer>
              <v-btn icon disabled>
                <v-icon>mdi-comment-outline</v-icon>
              </v-btn>
              <v-btn icon disabled>
                <v-icon>mdi-heart-circle-outline</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
      <div v-if="getPosts.length < 1 && !getLoadMorePostState">
        <v-card class="post">
          <v-card-title>
            <v-icon class="search-user-icon">mdi-account-search-outline</v-icon>
          </v-card-title>
          <v-card-text>
            <v-alert
              class="mt-1"
              border="bottom"
              colored-border
              type="info"
              elevation="2"
              icon="mdi-post-outline"
            >
              You haven't got any posts yet because you're not following anyone.
              Look for someone you can follow and enjoy reading.
            </v-alert>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-progress-linear
      :light="$vuetify.theme.dark"
      :dark="!$vuetify.theme.dark"
      :active="getLoadMorePostState"
      class="mx-1"
      indeterminate
      height="15"
      absolute
      bottom
    >
      <template v-slot>
        <strong class="caption">loading more...</strong>
      </template></v-progress-linear
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import router from "@/router";
import { namespace } from "vuex-class";
import { ActivityObject, Link } from "activitypub-objects";
import striptags from "striptags";

import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";
import Attachments from "@/views/home/post/attachments/index.vue";
import ActorPin from "@/components/actor/ActorPin.vue";
import Date from "@/components/ui/Date.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";
import { User } from "@/model/user";

const userStore = namespace("User");
const collectionStore = namespace("Collection");
const notifyStore = namespace("Notify");

@Component({
  components: {
    Attachments,
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
  @Watch("getPosts")
  private watchGetPosts(): void {
    if (document.getElementById("scroll-target")) {
      this.$vuetify.goTo("#scroll-target");
    }
  }

  @userStore.Getter
  public getUser!: User;

  @collectionStore.Getter
  public getPosts!: Array<ActivityObject | Link>;

  @collectionStore.Getter
  public hasNextPage!: boolean;

  @collectionStore.Getter
  public getLoadMorePostState!: boolean;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;

  @collectionStore.Action
  public nextCollectionPage!: (user: string) => Promise<void>;

  @notifyStore.Action
  public error!: (message: string) => void;

  private created(): void {
    this.initGetUser();
  }

  private initGetUser(): void {
    if (this.getUser) {
      this.fetchCollection(this.getUser.preferredUsername);
    } else {
      AuthenticationUtil.clear();
      this.error("Authentication is incorrect");
      router.push("/login");
    }
  }

  public getComponent(type: string): PostTypes {
    return PostTypes[type as keyof typeof PostTypes];
  }

  public onIntersect(entries: IntersectionObserverEntry[]): void {
    if (this.hasNextPage && entries[0].isIntersecting) {
      const target: Element = entries[0].target as Element;
      const index: number = +(target.getAttribute("data-index") ?? 0);

      if (index > this.getPosts.length - 3 && !this.getLoadMorePostState) {
        this.nextCollectionPage(this.getUser.preferredUsername);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-layout {
  position: relative;
  height: 100%;
}

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
