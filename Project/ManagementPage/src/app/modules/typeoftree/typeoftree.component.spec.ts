import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeoftreeComponent } from './typeoftree.component';

describe('TypeoftreeComponent', () => {
  let component: TypeoftreeComponent;
  let fixture: ComponentFixture<TypeoftreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeoftreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeoftreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
