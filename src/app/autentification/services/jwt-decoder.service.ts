import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtDecoderService {
  private _helper : JwtHelperService = new JwtHelperService();
  constructor() {}

  public getIdFromToken() : string | null {
    const token : string | null = localStorage.getItem('token');
    if (token) {
      return this._helper.decodeToken(token)?.id;
    }
    return null;
  }

  public getTypeFromToken() {
    const token : string | null = localStorage.getItem('token');
    if (token) {
      return this._helper.decodeToken(token)?.type;
    }
    return null;
  }
}
