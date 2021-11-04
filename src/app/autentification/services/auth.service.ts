import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loginUrl = 'http://localhost:8080/api/authenticate';
  constructor(private http: HttpClient) {}

  public loginUser(user: any) {
    return this.http.post<any>(this._loginUrl, user);
  }

  public isUserLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
