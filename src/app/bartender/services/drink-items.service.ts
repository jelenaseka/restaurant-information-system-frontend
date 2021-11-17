import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsForListBox } from '../bartender-homepage/model/items-for-listbox.model';
import { DrinkItemsDetails } from '../bartender-homepage/model/drinkitems-details.model';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stomp-websocket';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrinkItemsService {
  stompClient;

  constructor(private http: HttpClient) { }

  public connect(): void {
    var socket = new SockJS("http://localhost:8080/app/stomp");
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/greetings', (data) => {
        console.log(data);
        this.sendMessage();
      },
      error => {
        console.log( 'Subscribe: error: ' + error);
      },
      () => {
        console.log("bla");
      });
    });
  }

  public sendMessage(): void {
    this.stompClient.send('/app/hello', {}, "cao");
  }

  public getActiveItems() : Observable<ItemsForListBox[]> {
    return this.http.get<ItemsForListBox[]>("/drink-items/active");
  }

  public getItem(itemId : number) : Observable<DrinkItemsDetails> {
    return this.http.get<DrinkItemsDetails>("/drink-items/active/" + itemId);
  }

  public moveItem(itemId : number, userId : number) : Observable<ItemsForListBox> {
    return this.http.put<ItemsForListBox>("/drink-items/change-state", {
      itemId,
      userId
    });
  }

}
