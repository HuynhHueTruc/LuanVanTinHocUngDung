import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingtypeComponent } from './shippingtype.component';

describe('ShippingtypeComponent', () => {
  let component: ShippingtypeComponent;
  let fixture: ComponentFixture<ShippingtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
