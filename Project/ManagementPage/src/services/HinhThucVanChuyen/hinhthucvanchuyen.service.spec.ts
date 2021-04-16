import { TestBed } from '@angular/core/testing';

import { HinhthucvanchuyenService } from './hinhthucvanchuyen.service';

describe('HinhthucvanchuyenService', () => {
  let service: HinhthucvanchuyenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HinhthucvanchuyenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
