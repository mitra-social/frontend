<template>
  <div class="text-center">
    <v-dialog
      origin="center top"
      v-model="getIsOpen"
      @click:outside="toggleDialog({ title: undefined, components: undefined })"
    >
      <v-card :light="!$vuetify.theme.dark" :dark="$vuetify.theme.dark">
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

import Profile from "@/views/settings/Profile.vue";
import Password from "@/views/settings/Password.vue";
import SearchActor from "@/views/home/SearchActor.vue";
import { DialogSettings } from "../../model/dialog-settings";

const dialogStore = namespace("Dialog");

@Component({
  components: {
    Profile,
    Password,
    SearchActor,
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
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
  align-items: flex-start;
}
</style>
