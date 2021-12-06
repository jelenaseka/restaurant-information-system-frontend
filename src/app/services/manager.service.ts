import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UnregistaredUserTable } from '../manager/employees/models/unregistared-user-table.model';
import { UnregistaredUserDetails } from '../manager/employees/models/unregistered-user-details';
import { ManagerDetails } from '../system-admin/models/manager-details.model';
import { PasswordUpdate } from '../system-admin/models/password-update.model';

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
      `/unregistered-user/${id}`
    );
  }

  public getManagerById(id: number): Observable<ManagerDetails> {
    return this.http.get<ManagerDetails>(
      `/registered-user/${id}`
    );
  }

  public updateUser(id: number, form: FormGroup): Observable<UnregistaredUserDetails> {
    const model = this._mapFormToUnregisteredModel(form);
    return this.http.put<UnregistaredUserDetails>(
      `/unregistered-user/${id}`, model
    );
  }

  public updateManager(id: number, form: FormGroup): Observable<ManagerDetails> {
    const model = this._mapFormToManagerModel(form);
    return this.http.put<ManagerDetails>(
      `/registered-user/${id}`, model
    );
  }

  public addUser(form: FormGroup): Observable<UnregistaredUserDetails> {
    const model = this._mapFormToUnregisteredModel(form);
    return this.http.post<UnregistaredUserDetails>(
      `/unregistered-user`, model
    );
  }

  public changePassword(id: number, form: FormGroup): Observable<PasswordUpdate> {
    const model = {
      newPassword: form.controls['newPassword'].value,
      oldPassword: form.controls['oldPassword'].value
    }
    return this.http.put<PasswordUpdate>(
      `/registered-user/change-password/${id}`, model
    );
  }

  private _mapFormToUnregisteredModel(form: FormGroup): UnregistaredUserDetails {
    return {
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      emailAddress: form.controls['emailAddress'].value,
      phoneNumber: form.controls['phoneNumber'].value,
      salary: form.controls['salary'].value,
      type: form.controls['type'].value.toUpperCase(),
      pinCode: form.controls['pinCode'].value,
    };
  }

  private _mapFormToManagerModel(form: FormGroup): ManagerDetails {
    return {
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      emailAddress: form.controls['emailAddress'].value,
      phoneNumber: form.controls['phoneNumber'].value,
      salary: form.controls['salary'].value,
      type: form.controls['type'].value.toUpperCase(),
      username: form.controls['username'].value,
    };
  }
}
