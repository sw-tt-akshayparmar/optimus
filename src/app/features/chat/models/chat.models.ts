export class Message {
  public id!: string;
  public conversation_id!: string;
  public sender!: string;
  public content!: string;
  public created_at!: Date;
  public deleted_at!: Date | null;
  public is_deleted!: boolean;

  private constructor() {}
  static from(mObj: {
    id: string;
    conversation_id: string;
    sender: string;
    content: string;
    created_at: Date;
    deleted_at: Date | null;
    is_deleted: boolean;
  }): Message {
    const message = new Message();
    message.id = mObj.id;
    message.conversation_id = mObj.conversation_id;
    message.sender = mObj.sender;
    message.content = mObj.content;
    message.created_at = mObj.created_at;
    message.deleted_at = mObj.deleted_at;
    message.is_deleted = mObj.is_deleted;

    return message;
  }
  getCopy(): Message {
    const copy = Message.from({
      id: this.id,
      conversation_id: this.conversation_id,
      sender: this.sender,
      content: this.content,
      created_at: this.created_at,
      deleted_at: this.deleted_at,
      is_deleted: this.is_deleted,
    });
    return copy;
  }
}
