import { TestBed } from '@angular/core/testing';

import { TruycapService } from './truycap.service';

describe('TruycapService', () => {
  let service: TruycapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruycapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
