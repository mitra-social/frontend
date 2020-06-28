<template>
  <div class="text-center">
    <v-dialog
      v-model="getIsOpen"
      @click:outside="toggleDialog({ title: undefined, components: undefined })"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
          v-if="getTitle"
        >
          {{ getTitle }}
        </v-card-title>
        <v-card-text>
          <component :is="getComponent" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Profile from "@/views/settings/Profile.vue";
import Password from "@/views/settings/Password.vue";

const dialogStore = namespace("Dialog");

@Component({
  components: {
    Profile,
    Password,
  },
})
export default class MitraDialog extends Vue {
  private dialog = false;

  @dialogStore.Getter
  public getIsOpen!: boolean;

  @dialogStore.Getter
  public getTitle!: string;

  @dialogStore.Getter
  public getComponent!: string;

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: any) => Promise<void>;

  // public iii() {

  //   this.toggleDialog({title})
  // }
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

.v-card__text {
  width: inherit;
}
</style>
