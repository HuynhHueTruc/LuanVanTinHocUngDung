import { TestBed } from '@angular/core/testing';

import { TintucService } from './tintuc.service';

describe('TintucService', () => {
  let service: TintucService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TintucService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
