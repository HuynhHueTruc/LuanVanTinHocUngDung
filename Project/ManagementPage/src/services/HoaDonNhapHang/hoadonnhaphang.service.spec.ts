import { TestBed } from '@angular/core/testing';

import { HoadonnhaphangService } from './hoadonnhaphang.service';

describe('HoadonnhaphangService', () => {
  let service: HoadonnhaphangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoadonnhaphangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
