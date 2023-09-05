// Events that the frontend can add handlers for
export enum SlippiEventType {
  CONNECTION_STATUS_CHANGED = 'CONNECTION_STATUS_CHANGED'
}

export enum SlippiClientConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECT_WAIT = 'RECONNECT_WAIT'
}

type SlippiConnectionStatusChangedEvent = {
  type: SlippiEventType.CONNECTION_STATUS_CHANGED;
  status: SlippiClientConnectionStatus;
};

export type SlippiEventMap = {
  [SlippiEventType.CONNECTION_STATUS_CHANGED]: SlippiConnectionStatusChangedEvent;
};

export type SlippiEvent = SlippiEventMap[SlippiEventType];

export type SlippiBinding<T extends SlippiEventType> = {
  eventType: T;
  callback: (event: SlippiEventMap[T]) => void;
};

export interface SlippiService {
  connect(): void;
  onEvent(eventType: SlippiEventType, handle: (event: SlippiEventMap[typeof eventType]) => void): void;
}
