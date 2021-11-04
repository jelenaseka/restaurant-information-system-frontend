import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerAuthGuard implements CanActivate {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _jwt: JwtDecoderService
  ) {}

  canActivate(): boolean {
    const type = this._jwt.getTypeFromToken();
    if (this._auth.isUserLoggedIn() && type === 'MANAGER') {
      return true;
    }
    this._router.navigate(['/login']);
    return false;
  }
}
