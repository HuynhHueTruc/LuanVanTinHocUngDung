import { TestBed } from '@angular/core/testing';

import { DefautGuard } from './defaut.guard';

describe('DefautGuard', () => {
  let guard: DefautGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DefautGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
