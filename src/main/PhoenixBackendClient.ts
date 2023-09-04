// Types

import { PlayerType } from '@slippi/slippi-js';

// Events the frontend can add handlers for
enum PhoenixEventType {
  CHANNEL_JOINED = 'CHANNEL_JOINED',
  CHANNEL_JOIN_ERROR = 'CHANNEL_JOIN_ERROR'
}

type PhoenixChannelJoinedEvent = {
  type: PhoenixEventType.CHANNEL_JOINED;
  topic: string;
  clientCode: string;
};

type PhoenixChannelJoinErrorEvent = {
  type: PhoenixEventType.CHANNEL_JOIN_ERROR;
  topic: string;
  error: any;
};

type PhoenixEventMap = {
  [PhoenixEventType.CHANNEL_JOINED]: PhoenixChannelJoinedEvent;
  [PhoenixEventType.CHANNEL_JOIN_ERROR]: PhoenixChannelJoinErrorEvent;
};

type PhoenixEvent = PhoenixEventMap[PhoenixEventType];

type PhoenixBinding<T extends PhoenixEventType> = {
  eventType: T;
  callback: (event: PhoenixEventMap[T]) => void;
};

export interface PhoenixService {
  connect(): void;
  onEvent(eventType: PhoenixEventType, handle: (event: PhoenixEventMap[typeof eventType]) => void): void;
  gameStarted(players: PlayerType[]): void;
}

// Implementation

import { Socket, Channel } from 'phoenix-channels';

const SOCKET_URL = 'ws://127.0.0.1:4000/socket';
const CHANNEL_TOPIC = 'clients';

type ClientChannelConnectResponse = { client_code: string };

export class PhoenixBackendClient implements PhoenixService {
  socket: typeof Socket;
  channel: typeof Channel;

  private clientCode: string | undefined;
  private bindings: Array<PhoenixBinding<PhoenixEventType>>;

  constructor(token: string) {
    this.socket = new Socket(SOCKET_URL, { params: { client_token: token } });
    this.channel = this.socket.channel(CHANNEL_TOPIC, {});

    this.bindings = [];
  }

  gameStarted(players: PlayerType[]) {
    this.channel.isJoined() && this.channel.push('game_started', {
      client: this.clientCode!,
      players: players.map(p => p.connectCode).sort()
    });
  }

  connect() {
    this.socket.connect();

    this.channel.join()
      .receive('ok', (resp: ClientChannelConnectResponse) => {
        console.log('Joined successfully, reply:', resp);
        this.clientCode = resp.client_code;
        // UserData.writeData('client-code', resp.connect_code);

        this.handleEvent({
          type: PhoenixEventType.CHANNEL_JOINED,
          topic: this.channel.topic,
          clientCode: resp.client_code
        });
      })
      .receive('error', (resp: any) => {
        console.log('Unable to join:', resp);

        this.handleEvent({
          type: PhoenixEventType.CHANNEL_JOIN_ERROR,
          topic: this.channel.topic,
          error: resp
        });
      });
  }

  onEvent(eventType: PhoenixEventType, handle: (event: PhoenixEventMap[typeof eventType]) => void): void {
    this.bindings.push({ eventType, callback: handle })
  }

  // TODO: sendEvent, takes an outward facing event (game start) and forwards to the backend

  private handleEvent(event: PhoenixEvent): void {
    this.bindings.filter((bind) => bind.eventType === event.type)
      .forEach((bind) => { bind.callback(event); });
  }
}
