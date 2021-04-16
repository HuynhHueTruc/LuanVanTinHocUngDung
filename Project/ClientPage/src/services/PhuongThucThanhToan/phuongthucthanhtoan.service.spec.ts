import { TestBed } from '@angular/core/testing';

import { PhuongthucthanhtoanService } from './phuongthucthanhtoan.service';

describe('PhuongthucthanhtoanService', () => {
  let service: PhuongthucthanhtoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhuongthucthanhtoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
