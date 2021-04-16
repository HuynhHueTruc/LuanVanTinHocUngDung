import { TestBed } from '@angular/core/testing';

import { LoaicayService } from './loaicay.service';

describe('LoaicayService', () => {
  let service: LoaicayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaicayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
