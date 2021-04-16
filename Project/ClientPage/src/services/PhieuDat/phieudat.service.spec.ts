import { TestBed } from '@angular/core/testing';

import { PhieudatService } from './phieudat.service';

describe('PhieudatService', () => {
  let service: PhieudatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhieudatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
