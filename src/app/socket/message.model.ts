import { Events } from './event.enum';

export interface Message<Data = any> {
  clientId: string | null;
  roomId: string | null;
  messageId: string;
  event: Events;
  success: boolean;
  message: string;
  data: Data;
}
