import { TestBed } from '@angular/core/testing';

import { DiachiService } from './diachi.service';

describe('DiachiService', () => {
  let service: DiachiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiachiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
