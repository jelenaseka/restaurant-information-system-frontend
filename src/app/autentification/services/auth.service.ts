import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
import { UnregisteredUser } from '../models/unregistered-user.model';
>>>>>>> develop

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public loginUser(userCredentials: Credentials): Observable<string> {
    return this.http.post<string>('/authenticate', userCredentials);
  }

  public logoutUser(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public checkPinCode(pinCode: number, userType : string) : Observable<UnregisteredUser> {
    return this.http.get<UnregisteredUser>(`/unregistered-user/pin-code/${pinCode}?usertype=${userType}`);
  }
}
