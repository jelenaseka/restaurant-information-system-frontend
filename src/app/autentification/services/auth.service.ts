import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { Router } from '@angular/router';
import { UnregisteredUser } from '../models/unregistered-user.model';
import { JwtDecoderService } from './jwt-decoder.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private jwt: JwtDecoderService) {}

  public loginUser(userCredentials: Credentials): Observable<string> {
    return this.http.post<string>('/authenticate', userCredentials);
  }

  public logoutUser(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public isUserLoggedIn(): boolean {
    let loggedIn : boolean = !this.jwt.isTokenExpired();
    if(!loggedIn)
     localStorage.removeItem('token');
    return loggedIn;
  }

  public checkPinCode(pinCode: number, userType : string) : Observable<UnregisteredUser> {
    return this.http.get<UnregisteredUser>(`/unregistered-user/pin-code/${pinCode}?usertype=${userType}`);
  }
}
