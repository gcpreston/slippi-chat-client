// Types

import { ConnectionStatus } from '@slippi/slippi-js';

// Events that the frontend can add handlers for
enum SlippiEventType {
  CONNECTION_STATUS_CHANGED = 'CONNECTION_STATUS_CHANGED'
}

type SlippiConnectionStatusChangedEvent = {
  type: SlippiEventType.CONNECTION_STATUS_CHANGED;
  status: ConnectionStatus;
};

type SlippiEventMap = {
  [SlippiEventType.CONNECTION_STATUS_CHANGED]: SlippiConnectionStatusChangedEvent;
};

type SlippiEvent = SlippiEventMap[SlippiEventType];

type SlippiBinding<T extends SlippiEventType> = {
  eventType: T;
  callback: (event: SlippiEventMap[T]) => void;
};

export interface SlippiService {
  connect(): void;
  onEvent(eventType: SlippiEventType, handle: (event: SlippiEventMap[typeof eventType]) => void): void;
}

// Implementation

import { Ports, ConnectionEvent } from '@slippi/slippi-js';
// TODO: Why does this not work with import?
// import { SlpLiveStream, SlpRealTime } from '@vinceau/slp-realtime';
const { SlpLiveStream, SlpRealTime } = require('@vinceau/slp-realtime');

import { PhoenixService } from './PhoenixBackendClient';

const SLIPPI_ADDRESS = '127.0.0.1';
const SLIPPI_PORT = Ports.DEFAULT;
const CONNECTION_TYPE = 'dolphin';

export class SlippiClient implements SlippiService {
  backendClient: PhoenixService;
  livestream: typeof SlpLiveStream;

  private bindings: Array<SlippiBinding<SlippiEventType>>;

  constructor(backendClient: PhoenixService) {
    this.backendClient = backendClient;
    this.bindings = [];

    // TODO: The problem occurs when calling SlpLiveStream. Not sure why yet
    this.livestream = new SlpLiveStream(CONNECTION_TYPE);
    const realtime = new SlpRealTime();
    realtime.setStream(this.livestream);

    // Connect to Slippi
    this.livestream.connection.on(ConnectionEvent.STATUS_CHANGE, (status) => {
      console.log('got slippi status change', status);

      this.handleEvent({
        type: SlippiEventType.CONNECTION_STATUS_CHANGED,
        status
      });
    });

    // Handle game events
    realtime.game.start$.subscribe((payload) => {
      this.backendClient.gameStarted(payload.players);
    });
  }

  connect() {
    this.livestream.start(SLIPPI_ADDRESS, SLIPPI_PORT)
      .then(() => {
        console.log('in slippi livestream.start.then');
      })
      .catch(() => {
        console.log('in slippi livestream.start.catch');
      });
  }

  onEvent(eventType: SlippiEventType, handle: (event: SlippiEventMap[typeof eventType]) => void): void {
    this.bindings.push({ eventType, callback: handle })
  }

  private handleEvent(event: SlippiEvent): void {
    this.bindings.filter((bind) => bind.eventType === event.type)
      .forEach((bind) => { bind.callback(event); });
  }
}
