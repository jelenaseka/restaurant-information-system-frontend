import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../autentification/services/auth.service';
import { JwtDecoderService } from '../autentification/services/jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _jwt: JwtDecoderService
    ) { }

  canActivate(): boolean {
    if (!this._auth.isUserLoggedIn()) {
      return true;
    }

    const type = this._jwt.getTypeFromToken();
    if (type === 'MANAGER') {
      this._router.navigate(['/home/manager']);
    } else if(type === 'ADMIN') {
      this._router.navigate(['/home/admin']);
    } else {
      this._router.navigate(['/home/system-admin']);
    }
    return false;
  }

}
