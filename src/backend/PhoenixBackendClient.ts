import { Socket, Channel } from 'phoenix-channels';
// import { Socket, Channel } from 'phoenix';
import type { PlayerType } from '@slippi/slippi-js';

import { PhoenixService, PhoenixBinding, PhoenixEventType, PhoenixEvent, PhoenixEventMap } from './types';

const SOCKET_URL = 'ws://127.0.0.1:4000/socket';
const CHANNEL_TOPIC = 'clients';

type ClientChannelConnectResponse = { connect_code: string };

export class PhoenixBackendClient implements PhoenixService {
  private socket: typeof Socket;
  private channel: typeof Channel | null;

  private clientCode: string | undefined;
  private bindings: Array<PhoenixBinding<PhoenixEventType>>;

  constructor(token: string) {
    this.socket = new Socket(SOCKET_URL, { params: { client_token: token } });

    this.bindings = [];
  }

  gameStarted(players: PlayerType[]) {
    this.channel && this.channel.push('game_started', {
      client: this.clientCode!,
      players: players.map(p => p.connectCode).sort()
    });
  }

  connect() {
    this.socket.connect();
    this.channel = this.socket.channel(CHANNEL_TOPIC, {});

    this.channel.join()
      .receive('ok', (resp: ClientChannelConnectResponse) => {
        console.log('Joined successfully, reply:', resp);
        this.clientCode = resp.connect_code;

        this.handleEvent({
          type: PhoenixEventType.CHANNEL_JOINED,
          topic: this.channel.topic,
          clientCode: resp.connect_code
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

  clearBindings(): void {
    this.bindings = [];
  }

  // TODO: sendEvent, takes an outward facing event (game start) and forwards to the backend

  private handleEvent(event: PhoenixEvent): void {
    this.bindings.filter((bind) => bind.eventType === event.type)
      .forEach((bind) => { bind.callback(event); });
  }
}
