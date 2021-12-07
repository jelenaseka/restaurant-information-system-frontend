import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from '../system-admin/models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  public getItemsForMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>('/item/menu');
  }

  public deleteItem(id: number): Observable<string> {
    return this.http.delete<string>(`/item/${id}`);
  }
}
