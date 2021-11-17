import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stomp-websocket';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private stompClient: any;

  constructor() {
    let socket = new SockJS(env.socketUrl);
    this.stompClient = Stomp.over(socket);
   }

  public connect(topicName: string): void {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${topicName}`, (data) => {
        console.log(data);
      },
      error => {
        console.log( 'Subscribe: error: ' + error);
      });
    });
  }

  public sendMessage(endpointName: string, message: string): void {
    this.stompClient.send(`/app/${endpointName}`, {}, message);
  }
}
