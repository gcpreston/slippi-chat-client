import { Ports, ConnectionEvent, ConnectionStatus } from '@slippi/slippi-js';
// TODO: Why does this not work with import?
// import { SlpLiveStream, SlpRealTime } from '@vinceau/slp-realtime';
const { SlpLiveStream, SlpRealTime } = require('@vinceau/slp-realtime');

import { SlippiService, SlippiBinding, SlippiEventType, SlippiEventMap, SlippiEvent, SlippiClientConnectionStatus } from './types';
import { PhoenixService } from '../backend/types';

const SLIPPI_ADDRESS = '127.0.0.1';
const SLIPPI_PORT = Ports.DEFAULT;
const CONNECTION_TYPE = 'dolphin';

function toClientStatus(status: ConnectionStatus): SlippiClientConnectionStatus {
  switch (status) {
    case ConnectionStatus.DISCONNECTED:
      return SlippiClientConnectionStatus.DISCONNECTED;
    case ConnectionStatus.CONNECTING:
      return SlippiClientConnectionStatus.CONNECTING;
    case ConnectionStatus.CONNECTED:
      return SlippiClientConnectionStatus.CONNECTED;
    case ConnectionStatus.RECONNECT_WAIT:
      return SlippiClientConnectionStatus.RECONNECT_WAIT;
  }
}

export default class SlippiClient implements SlippiService {
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
    this.livestream.connection.on(ConnectionEvent.STATUS_CHANGE, (status: ConnectionStatus) => {
      this.handleEvent({
        type: SlippiEventType.CONNECTION_STATUS_CHANGED,
        status: toClientStatus(status)
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
      .catch((err) => {
        console.log('in slippi livestream.start.catch', err);
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
