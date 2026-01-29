import { Events } from './events.enum';

export interface Message<Data = any> {
  event: Events;
  code?: CodeEnum;
  room?: string | string[];
  clientId: string;
  messageId: string;
  success: boolean;
  message: string;
  data: Data;
}

export enum CodeEnum {}

export default CodeEnum;
