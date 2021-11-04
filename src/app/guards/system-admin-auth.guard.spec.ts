import { TestBed } from '@angular/core/testing';

import { SystemAdminAuthGuard } from './system-admin-auth.guard';

describe('SystemAdminAuthGuard', () => {
  let guard: SystemAdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SystemAdminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
