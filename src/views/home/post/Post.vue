<template>
  <div>
    <v-card class="post" v-if="post">
      <v-expansion-panels
        class="in-reply-to-expansion"
        flat
        v-if="!!post.inReplyTo && typeof post.inReplyTo === 'object'"
      >
        <v-expansion-panel>
          <v-expansion-panel-header
            color="grey lighten-4 grey--text text--darken-1"
          >
            <div class="d-flex flex-row align-baseline">
              <v-icon color="grey">mdi-reply</v-icon>
              <span>View post that has been replied to</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content
            class="in-reply-to-expansion-content"
            color="grey lighten-4"
          >
            <Post class="in-reply-to" :post="post.inReplyTo" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="headline"
            v-if="post.name || post.summary"
            >{{
              post.name ? post.name : post.summary | stripHtmlTags
            }}</v-list-item-title
          >
          <v-list-item-subtitle>
            <div class="d-flex flex-row justify-space-between">
              <ActorPin v-if="post.attributedTo" :actor="post.attributedTo" />
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
            ((Array.isArray(post.attachment) && post.attachment.length > 0) ||
              !Array.isArray(post.attachment))
          "
          :attachments="post.attachment"
          :postIndex="postIndex"
        />
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
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
</template>

<script lang="ts">
import { ActivityObject, Link } from "activitypub-objects";
import { Component, Prop, Vue } from "vue-property-decorator";
import striptags from "striptags";

import ActorPin from "@/components/actor/ActorPin.vue";
import Date from "@/components/ui/Date.vue";
import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";
import Attachments from "@/views/home/post/attachments/index.vue";
import { PostTypes } from "@/utils/post-types";

@Component({
  components: {
    ActivityStreamsArticleType,
    ActivityStreamsNoteType,
    ActorPin,
    Attachments,
    Date,
  },
  filters: {
    stripHtmlTags(value: string) {
      return striptags(value);
    },
  },
})
export default class Post extends Vue {
  /************************
   * component properties
   ************************/

  @Prop() post!: ActivityObject | Link;
  @Prop() postIndex!: number;

  /**********************
   * public functions
   **********************/
  public getComponent(type: string): PostTypes {
    return PostTypes[type as keyof typeof PostTypes];
  }
}
</script>
<style lang="scss" scoped>
.in-reply-to > .theme--light.v-card {
  background-color: #e0e0e0;
}

.in-reply-to-expansion > .v-expansion-panel--active > .v-expansion-panel-header,
.in-reply-to-expansion > .v-expansion-panel-header {
  min-height: 30px;
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
