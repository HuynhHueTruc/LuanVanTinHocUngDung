import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypetreeComponent } from './typetree.component';

describe('TypetreeComponent', () => {
  let component: TypetreeComponent;
  let fixture: ComponentFixture<TypetreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypetreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypetreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
