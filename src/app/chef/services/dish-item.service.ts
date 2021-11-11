import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsForListBox } from 'src/app/bartender/bartender-homepage/model/items-for-listbox.model';
import { DishItemDetails } from '../chef-homepage/model/dishitem-details.model';

@Injectable({
  providedIn: 'root'
})
export class DishItemService {

  constructor(private http: HttpClient) { }

  public getActiveItems() : Observable<ItemsForListBox[]> {
    return this.http.get<ItemsForListBox[]>("/dish-item/active");
  }

  public getItem(itemId : number) : Observable<DishItemDetails> {
    return this.http.get<DishItemDetails>("/dish-item/" + itemId);
  }

  public moveItem(itemId : number, userId : number) : Observable<ItemsForListBox> {
    return this.http.put<ItemsForListBox>("/dish-item", {
      itemId,
      userId
    });
  }

}
