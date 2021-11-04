import { TestBed } from '@angular/core/testing';

import { LoginManagerAuthGuard } from './login-manager-auth.guard';

describe('LoginManagerAuthGuard', () => {
  let guard: LoginManagerAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginManagerAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
