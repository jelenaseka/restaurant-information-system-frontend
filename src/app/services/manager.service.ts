import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnregistaredUserTable } from '../manager/employees/models/unregistared-user-table.model';
import { UnregistaredUserDetails } from '../manager/employees/models/unregistered-user-details';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}

  public getUnregisteredUsers(): Observable<UnregistaredUserTable[]> {
    return this.http.get<UnregistaredUserTable[]>('/unregistered-user/table');
  }

  public getUnregisteredUserById(
    id: number
  ): Observable<UnregistaredUserDetails> {
    return this.http.get<UnregistaredUserDetails>(
      `/unregistered-user/details/${id}`
    );
  }
}
