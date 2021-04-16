import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftnavComponent } from './liftnav.component';

describe('LiftnavComponent', () => {
  let component: LiftnavComponent;
  let fixture: ComponentFixture<LiftnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiftnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiftnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
