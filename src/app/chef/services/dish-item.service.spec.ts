import { TestBed } from '@angular/core/testing';

import { DishItemService } from './dish-item.service';

describe('DishItemService', () => {
  let service: DishItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DishItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
