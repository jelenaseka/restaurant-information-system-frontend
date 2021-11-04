import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
    ]),
  });

  constructor() {}

  ngOnInit(): void {}

  validateEmail() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.get('email')?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  validatePassword() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Minimum number of characters is 5';
    }
    return this.loginForm.get('password')?.hasError('pattern')
      ? 'Has to contain lowercase, uppercase letters and numbers'
      : '';
  }

  loginUser() {
    console.log(this.loginForm.invalid);
    if (this.loginForm.invalid) {
      return;
    }
    console.warn(this.loginForm.value);
  }
}
