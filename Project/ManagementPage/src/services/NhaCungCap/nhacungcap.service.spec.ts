import { TestBed } from '@angular/core/testing';

import { NhacungcapService } from './nhacungcap.service';

describe('NhacungcapService', () => {
  let service: NhacungcapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NhacungcapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
