import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { DrinkItems } from '../bartender-homepage/model/DrinkItems.model';
import { DrinkItemsDetails } from '../bartender-homepage/model/DrinkItemsDetails.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  public getActiveItems() : Observable<DrinkItems[]> {
    return this.http.get<DrinkItems[]>("/drink-items/active");
  }

  public getItem(itemId : number) : Observable<DrinkItemsDetails> {
    return this.http.get<DrinkItemsDetails>("/drink-items/" + itemId);
  }


}
