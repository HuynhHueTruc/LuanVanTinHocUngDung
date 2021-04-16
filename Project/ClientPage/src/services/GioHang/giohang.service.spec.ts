import { TestBed } from '@angular/core/testing';

import { GiohangService } from './giohang.service';

describe('GiohangService', () => {
  let service: GiohangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiohangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
