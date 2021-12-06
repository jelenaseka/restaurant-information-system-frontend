import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  public getOrderByRestaurantTableNameIfWaiterValid(tableName: string, pinCode: string): Observable<OrderDTO> {
    return this.http.get<OrderDTO>("/order/" + tableName + "/" + pinCode);
  }
}
