import { RequestStatus } from './chat.enum';
import { User } from '../../../models/User.model';

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
    return Message.from({
      id: this.id,
      conversation_id: this.conversation_id,
      sender: this.sender,
      content: this.content,
      created_at: this.created_at,
      deleted_at: this.deleted_at,
      is_deleted: this.is_deleted,
    });
  }
}

export class Request {
  public id!: string;
  public sender!: string;
  public receiver!: string;
  public status!: RequestStatus;
  public description?: string;

  public sender_user?: User;
  public receiver_user?: User;

  private constructor() {}

  static from(rObj: {
    id: string;
    sender: string;
    receiver: string;
    status: RequestStatus;
    description?: string | null;
    sender_user?: User;
    receiver_user?: User;
  }): Request {
    const request = new Request();
    request.id = rObj.id;
    request.sender = rObj.sender;
    request.receiver = rObj.receiver;
    request.status = rObj.status;
    request.receiver = rObj.receiver;
    request.sender_user = rObj.sender_user ? User.from(rObj.sender_user) : rObj.sender_user;
    request.receiver_user = rObj.receiver_user ? User.from(rObj.receiver_user) : rObj.receiver_user;

    return request;
  }

  getCopy(): Request {
    return Request.from({
      id: this.id,
      sender: this.sender,
      receiver: this.receiver,
      status: this.status,
      description: this.description,
      sender_user: this.sender_user,
      receiver_user: this.receiver_user,
    });
  }
}
