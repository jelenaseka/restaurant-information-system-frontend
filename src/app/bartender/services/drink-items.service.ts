import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { DrinkItemsForListBox } from '../bartender-homepage/model/drinkitems-for-listbox.model';
import { DrinkItemsDetails } from '../bartender-homepage/model/drinkitems-details.model';

@Injectable({
  providedIn: 'root'
})
export class DrinkItemsService {

  constructor(private http: HttpClient) { }

  public getActiveItems() : Observable<DrinkItemsForListBox[]> {
    return this.http.get<DrinkItemsForListBox[]>("/drink-items/active");
  }

  public getItem(itemId : number) : Observable<DrinkItemsDetails> {
    return this.http.get<DrinkItemsDetails>("/drink-items/" + itemId);
  }

  public moveItem(itemId : number, userId : number) : Observable<DrinkItemsForListBox> {
    return this.http.put<DrinkItemsForListBox>("/drink-items", {
      itemId,
      userId
    });
  }

}
