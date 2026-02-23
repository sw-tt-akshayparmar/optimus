import { Project } from './Project.model';
import { Message, Reaction, Request } from '../features/chat/models/chat.models';

export class User {
  public id!: string;
  public username!: string;
  public name!: string;
  public password?: string;
  public created_at!: Date;
  public deleted_at!: Date | null;
  public is_deleted!: boolean;

  // Related fields fields
  projects?: Project[];
  messages?: Message[];
  requests_sent?: Request[];
  requests_received?: Request[];
  reactions?: Reaction[];

  // games_as_white?: Game[];
  // games_as_black?: Game[];
  private constructor() {}

  static from(
    userObj: {
      id: string;
      username: string;
      name: string;
      password?: string;
      created_at: Date;
      deleted_at?: Date | null;
      is_deleted?: boolean;

      projects?: Project[];
      messages?: Message[];
      requests_sent?: Request[];
      requests_received?: Request[];
      reactions?: Reaction[];
    },
    password?: boolean,
  ): User {
    const user = new User();
    user.id = userObj.id;
    user.username = userObj.username;
    user.name = userObj.name;
    user.password = password ? userObj.password : undefined;
    user.created_at = userObj.created_at;
    user.deleted_at = userObj.deleted_at ?? null;
    user.is_deleted = userObj.is_deleted ?? false;

    if (userObj.projects && userObj.projects.length > 0) {
      user.projects = userObj.projects.map((p) => Project.from(p));
    }

    if (userObj.messages && userObj.messages.length > 0) {
      user.messages = userObj.messages.map((m) => Message.from(m));
    }

    if (userObj.requests_sent && userObj.requests_sent.length > 0) {
      user.requests_sent = userObj.requests_sent.map((r) => Request.from(r));
    }
    if (userObj.requests_received && userObj.requests_received.length > 0) {
      user.requests_received = userObj.requests_received.map((r) => Request.from(r));
    }
    if (userObj.reactions && userObj.reactions.length > 0) {
      user.reactions = userObj.reactions.map((r) => Reaction.from(r));
    }
    return user;
  }
  getCopy(): User {
    return User.from({
      id: this.id,
      username: this.username,
      name: this.name,
      password: this.password,
      created_at: this.created_at,
      deleted_at: this.deleted_at,
      is_deleted: this.is_deleted,

      // profile: this.profile,
      projects: this.projects,
      messages: this.messages,
      requests_sent: this.requests_sent,
      requests_received: this.requests_received,
      reactions: this.reactions,
      // games_as_white: this.games_as_white,
      // games_as_black: this.games_as_black,
    });
  }
}
