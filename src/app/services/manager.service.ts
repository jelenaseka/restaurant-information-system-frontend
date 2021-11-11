import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  public getUnregisteredUserById(id: number): Observable<UnregistaredUserDetails> {
    return this.http.get<UnregistaredUserDetails>(
      `/unregistered-user/details/${id}`
    );
  }

  public updateUser(id: number, form: FormGroup): Observable<UnregistaredUserDetails> {
    const model: UnregistaredUserDetails = {
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      emailAddress: form.controls['emailAddress'].value,
      phoneNumber: form.controls['phoneNumber'].value,
      salary: form.controls['salary'].value,
      type: form.controls['type'].value.toUpperCase(),
      pinCode: form.controls['pinCode'].value,
    }
    return this.http.put<UnregistaredUserDetails>(
      `/unregistered-user/${id}`, model
    );
  }

  public addUser(form: FormGroup): Observable<UnregistaredUserDetails> {
    const model: UnregistaredUserDetails = {
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      emailAddress: form.controls['emailAddress'].value,
      phoneNumber: form.controls['phoneNumber'].value,
      salary: form.controls['salary'].value,
      type: form.controls['type'].value.toUpperCase(),
      pinCode: form.controls['pinCode'].value,
    }
    return this.http.post<UnregistaredUserDetails>(
      `/unregistered-user`, model
    );
  }
}
