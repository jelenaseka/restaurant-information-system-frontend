import { TestBed } from '@angular/core/testing';

import { DrinkItemsService } from './drink-items.service';

describe('DrinkItemsService', () => {
  let service: DrinkItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrinkItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
