import { TestBed } from '@angular/core/testing';

import { LoginSystemAdminAuthGuard } from './login-system-admin-auth.guard';

describe('LoginSystemAdminAuthGuard', () => {
  let guard: LoginSystemAdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginSystemAdminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
