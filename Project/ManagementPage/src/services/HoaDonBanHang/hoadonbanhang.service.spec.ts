import { TestBed } from '@angular/core/testing';

import { HoadonbanhangService } from './hoadonbanhang.service';

describe('HoadonbanhangService', () => {
  let service: HoadonbanhangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoadonbanhangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
