import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import { NotifyType } from '@/model/notify-type';
import { Notify } from '@/model/notify';

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

  @Action
  public error(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.ERROR });
  }

  @Action
  public warning(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.WARNING });
  }

  @Action
  public success(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.SUCCESS });
  }

  @Action
  public info(message: string): void {
    this.context.commit("setNofify", { message, type: NotifyType.INFO });
  }
}
export default NotifyStore;
