import { TestBed } from '@angular/core/testing';

import { LoginAdminAuthGuard } from './login-admin-auth.guard';

describe('LoginAdminAuthGuard', () => {
  let guard: LoginAdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginAdminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
