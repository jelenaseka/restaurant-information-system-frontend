import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../autentification/services/auth.service';
import { JwtDecoderService } from '../autentification/services/jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _jwt: JwtDecoderService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
      if (!this._auth.isUserLoggedIn()) {
        this._router.navigate(['/login']);
        return false;
      }
      const expectedRole = route.data.expectedRole;
      const type = this._jwt.getTypeFromToken();
      if (type !== expectedRole) {
        this._router.navigate(['/login']);
        return false;
      }
      return true;
    
    }
}
