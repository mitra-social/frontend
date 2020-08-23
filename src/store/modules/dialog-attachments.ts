import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import { AddAttachmentsParam } from "@/model/add-attachments-param";
import { Attachment } from "@/model/attachment";
import { SelectedAttachmentParam } from "@/model/selected-attachment-param";

@Module({ namespaced: true })
class DialogAttachmentsStore extends VuexModule {
  private attachments: Map<number, Attachment[]> = new Map();
  private indexSelectedAttachment = 0;
  private indexSelectedAttachments = 0;

  get getSelectedAttachmentIndex(): number {
    return this.indexSelectedAttachment;
  }

  get getSelectedAttachments(): Attachment[] | undefined {
    return this.attachments.get(this.indexSelectedAttachments);
  }

  @Mutation
  public addAttachments({ index, attachments }: AddAttachmentsParam): void {
    this.attachments.set(index, attachments);
  }

  @Mutation
  public setAttachments(map: Map<number, Attachment[]>): void {
    this.attachments = map;
  }

  @Mutation
  public setSelectedAttachment(index: number): void {
    this.indexSelectedAttachment = index;
  }

  @Mutation
  public setSelectedAttachments(index: number): void {
    this.indexSelectedAttachments = index;
  }

  @Action
  public async setSelectedAttachmentAction({
    postIndex,
    attachIndex,
  }: SelectedAttachmentParam): Promise<void> {
    this.context.commit("setSelectedAttachments", postIndex);
    this.context.commit("setSelectedAttachment", attachIndex);
  }

  @Action({ rawError: true })
  public addAttachmentsAction(attachments: AddAttachmentsParam): void {
    this.context.commit("addAttachments", attachments);
  }

  @Action({ rawError: true })
  public async setSelectedPostAttachments(index: number): Promise<void> {
    this.context.commit("setSelectedAttachments", index);
  }

  @Action({ rawError: true })
  public reset(): void {
    this.context.commit("setSelectedAttachment", 0);
    this.context.commit("setSelectedAttachments", 0);
    this.context.commit("setAttachments", new Map());
  }
}
export default DialogAttachmentsStore;
