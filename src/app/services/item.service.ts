import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemCategoryCreate } from '../system-admin/models/item-category-create.model';
import { ItemCategory } from '../system-admin/models/item-category.model';
import { ItemCreate } from '../system-admin/models/item-create.model';
import { ItemDetails } from '../system-admin/models/item-details.model';
import { ItemUpdate } from '../system-admin/models/item-update.model';
import { MenuItem } from '../system-admin/models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  public getItemDetails(id: number): Observable<ItemDetails> {
    return this.http.get<ItemDetails>(`/item/not-active/${id}`);
  }

  public getItemsForMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>('/item/menu');
  }

  public discardChanges(): Observable<void> {
    return this.http.post<void>('/item/discard-changes', null);
  }

  public saveChanges(): Observable<void> {
    return this.http.post<void>('/item/save-changes', null);
  }

  public deleteItem(id: number): Observable<string> {
    return this.http.delete<string>(`/item/${id}`);
  }

  public createItem(item: ItemCreate): Observable<string> {
    return this.http.post<string>('/item', item);
  }

  public updateItem(item: ItemUpdate, id: number): Observable<string> {
    return this.http.put<string>(`/item/${id}`, item);
  }

  public getCategoriesForDrinks(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>('/item-category/drink');
  }

  public getCategoriesForDishes(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>('/item-category/dish');
  }

  public deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/item-category/${id}`);
  }

  public createCategory(category: ItemCategoryCreate): Observable<string> {
    return this.http.post<string>('/item-category', category);
  }
}
