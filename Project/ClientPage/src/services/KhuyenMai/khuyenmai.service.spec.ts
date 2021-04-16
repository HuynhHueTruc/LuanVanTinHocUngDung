import { TestBed } from '@angular/core/testing';

import { KhuyenmaiService } from './khuyenmai.service';

describe('KhuyenmaiService', () => {
  let service: KhuyenmaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KhuyenmaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
