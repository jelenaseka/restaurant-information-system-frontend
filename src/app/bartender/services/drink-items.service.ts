import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsForListBox } from '../bartender-homepage/model/items-for-listbox.model';
import { DrinkItemsDetails } from '../bartender-homepage/model/drinkitems-details.model';

@Injectable({
  providedIn: 'root'
})
export class DrinkItemsService {
  constructor(private http: HttpClient) { }

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
