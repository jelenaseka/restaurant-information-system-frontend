import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { Router } from '@angular/router';
import { JwtDecoderService } from 'src/app/autentification/services/jwt-decoder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide : boolean = true;
  loginForm : FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
    ]),
  });

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _jwt: JwtDecoderService
  ) {}

  ngOnInit(): void {}

  validateUsername() : string {
    if (this.loginForm.get('username')?.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  validatePassword() : string {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Minimum number of characters is 5';
    }
    // return this.loginForm.get('password')?.hasError('pattern')
    //   ? 'Has to contain lowercase, uppercase letters and numbers'
    //   : '';
    return '';
  }

  loginUser() : void {
    if (this.loginForm.invalid) {
      return;
    }
    this._auth.loginUser(this.loginForm.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        const type = this._jwt.getTypeFromToken();
        if (type === 'MANAGER') {
          this._router.navigate(['/home/manager']);
        } else if (type === 'ADMIN') {
          this._router.navigate(['/home/admin']);
        } else if (type === 'SYSTEM_ADMIN') {
          this._router.navigate(['/home/system-admin']);
        } else {
          this._router.navigate(['/login']);
        }
      },
      (err: any) => console.log(err)
    );
  }
}
