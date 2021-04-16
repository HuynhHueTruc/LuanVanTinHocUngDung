import { TestBed } from '@angular/core/testing';

import { ThongtincuahangService } from './thongtincuahang.service';

describe('ThongtincuahangService', () => {
  let service: ThongtincuahangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThongtincuahangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
