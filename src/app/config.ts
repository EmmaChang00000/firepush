export const BaseUrl = '/api';
export const LocalUrl = 'http://localhost:12345';

export interface IMsg {
  target: 'notification' | 'push';
  states: 'success' | 'fail' | 'wait';
  detail: string;
  timestamp: number;
}

export interface IResponse {
  result: 'success' | 'fail';
  detail: string;
  timestamp: number;
}

export type TCheckPush = 'success' | 'permissionNot' | 'tokenNot' | 'apiNot';
