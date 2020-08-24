import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import { Notify } from "@/model/notify";
import { NotifyType } from "@/model/notify-type";

@Module({ namespaced: true })
class NotifyStore extends VuexModule {
  private notification: Notify | undefined;

  get getNotify() {
    return this.notification;
  }

  @Mutation
  public setNofify(notification: Notify): void {
    this.notification = notification;
  }

  @Action({ rawError: true })
  public error(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.ERROR });
  }

  @Action({ rawError: true })
  public info(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.INFO });
  }

  @Action({ rawError: true })
  public success(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.SUCCESS });
  }

  @Action({ rawError: true })
  public warning(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.WARNING });
  }
}
export default NotifyStore;
