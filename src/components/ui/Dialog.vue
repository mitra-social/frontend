<template>
  <div class="text-center">
    <v-dialog
      origin="center top"
      v-model="getIsOpen"
      :fullscreen="getIsFullsize"
      @click:outside="toggleDialog({ title: undefined, components: undefined })"
    >
      <v-card :light="!$vuetify.theme.dark" :dark="$vuetify.theme.dark">
        <v-btn
          icon
          absolute
          right
          @click="toggleDialog({ title: undefined, components: undefined })"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title primary-title v-if="getTitle">
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

import AttachmentDialog from "@/components/attachment/AttachmentDialog.vue";
import { DialogSettings } from "@/model/dialog-settings";
import Profile from "@/views/settings/Profile.vue";
import Password from "@/views/settings/Password.vue";
import SearchActor from "@/views/home/SearchActor.vue";

const dialogStore = namespace("Dialog");

@Component({
  components: {
    AttachmentDialog,
    Password,
    Profile,
    SearchActor,
  },
})
export default class MitraDialog extends Vue {
  /**********************
   * store getters
   **********************/

  @dialogStore.Getter
  public getComponent!: string;

  @dialogStore.Getter
  public getIsFullsize!: string;

  @dialogStore.Getter
  public getIsOpen!: boolean;

  @dialogStore.Getter
  public getTitle!: string;

  /**********************
   * store actions
   **********************/
  @dialogStore.Action
  public toggleDialog!: (settings: DialogSettings) => Promise<void>;
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
  align-items: flex-start;
}
</style>
