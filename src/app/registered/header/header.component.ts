import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { JwtDecoderService } from 'src/app/autentification/services/jwt-decoder.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  _type: string | null = null;
  constructor(private _auth: AuthService, private _jwt: JwtDecoderService) {}

  ngOnInit(): void {
    this._type = this._jwt.getTypeFromToken();
  }

  logout(): void {
    this._auth.logoutUser();
  }
}
