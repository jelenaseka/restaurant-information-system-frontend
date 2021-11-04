import { TestBed } from '@angular/core/testing';

import { ManagerAuthGuard } from './manager-auth.guard';

describe('ManagerAuthGuardGuard', () => {
  let guard: ManagerAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManagerAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
