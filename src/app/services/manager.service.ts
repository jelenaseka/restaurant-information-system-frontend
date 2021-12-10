import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserTableInfo } from '../unregistered/models/user-table-info.model';
import { UnregistaredUserDetails } from '../unregistered/models/unregistered-user-details';
import { RegisteredUserCreate } from '../registered/models/registered-user-create.model';
import { RegisteredUserDetails } from '../registered/models/registered-user-details.model';
import { PasswordUpdate } from '../registered/models/password-update.model';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}

  public getUnregisteredUsers(): Observable<UserTableInfo[]> {
    return this.http.get<UserTableInfo[]>('/unregistered-user/table');
  }

  public getUnregisteredUserById(id: number): Observable<UnregistaredUserDetails> {
    return this.http.get<UnregistaredUserDetails>(
      `/unregistered-user/${id}`
    );
  }

  public getRegisteredUserById(id: number): Observable<RegisteredUserDetails> {
    return this.http.get<RegisteredUserDetails>(
      `/registered-user/${id}`
    );
  }

  public getWorkers(): Observable<UserTableInfo[]> {
    return this.http.get<UserTableInfo[]>('/user/table');
  }

  public getSystemAdmins(): Observable<UserTableInfo[]> {
    return this.http.get<UserTableInfo[]>('/registered-user/system-admin/table');
  }

  public updateUser(id: number, form: FormGroup): Observable<UnregistaredUserDetails> {
    const model = this._mapFormToUnregisteredModel(form);
    return this.http.put<UnregistaredUserDetails>(
      `/unregistered-user/${id}`, model
    );
  }

  public updateRegisteredUser(id: number, form: FormGroup): Observable<RegisteredUserDetails> {
    const model = this._mapFormToRegisteredUserDetailsModel(form);
    return this.http.put<RegisteredUserDetails>(
      `/registered-user/${id}`, model
    );
  }

  public addUser(form: FormGroup): Observable<UnregistaredUserDetails> {
    const model = this._mapFormToUnregisteredModel(form);
    return this.http.post<UnregistaredUserDetails>(
      `/unregistered-user`, model
    );
  }

  //TODO: Ovo isto videti preimenovati
  public addRegisteredUser(form: FormGroup, type: string): Observable<RegisteredUserCreate> {
    const model = this._mapFormToRegisteredUserCreateModel(form, type);
    return this.http.post<RegisteredUserCreate>(
      `/registered-user`, model
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

  private _mapFormToRegisteredUserDetailsModel(form: FormGroup): RegisteredUserDetails {
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

  private _mapFormToRegisteredUserCreateModel(form: FormGroup, type: string): RegisteredUserCreate {
    return {
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      emailAddress: form.controls['emailAddress'].value,
      phoneNumber: form.controls['phoneNumber'].value,
      salary: form.controls['salary'].value,
      type: type,
      username: form.controls['username'].value,
      password: form.controls['newPassword'].value,
    };
  }
}
