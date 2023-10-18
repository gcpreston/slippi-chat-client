import type { PlayerType } from '@slippi/slippi-js';

// Events the frontend can add handlers for
export enum PhoenixEventType {
  CHANNEL_JOINING = 'CHANNEL_JOINING',
  CHANNEL_JOINED = 'CHANNEL_JOINED',
  CHANNEL_JOIN_ERROR = 'CHANNEL_JOIN_ERROR'
}

export type PhoenixChannelJoiningEvent = {
  type: PhoenixEventType.CHANNEL_JOINING;
  topic: string;
  token: string;
};

export type PhoenixChannelJoinedEvent = {
  type: PhoenixEventType.CHANNEL_JOINED;
  topic: string;
  clientCode: string;
};

export type PhoenixChannelJoinErrorEvent = {
  type: PhoenixEventType.CHANNEL_JOIN_ERROR;
  topic: string;
  error: any;
};

export type PhoenixEventMap = {
  [PhoenixEventType.CHANNEL_JOINING]: PhoenixChannelJoiningEvent;
  [PhoenixEventType.CHANNEL_JOINED]: PhoenixChannelJoinedEvent;
  [PhoenixEventType.CHANNEL_JOIN_ERROR]: PhoenixChannelJoinErrorEvent;
};

export type PhoenixEvent = PhoenixEventMap[PhoenixEventType];

export type PhoenixBinding<T extends PhoenixEventType> = {
  eventType: T;
  callback: (event: PhoenixEventMap[T]) => void;
};

export interface PhoenixService {
  connect(): void;
  onEvent(eventType: PhoenixEventType, handle: (event: PhoenixEventMap[typeof eventType]) => void): void;
  clearBindings(): void;
  gameStarted(players: PlayerType[]): void;
}
