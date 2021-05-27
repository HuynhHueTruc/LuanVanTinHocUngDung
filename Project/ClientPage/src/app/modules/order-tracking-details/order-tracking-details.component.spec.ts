import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrackingDetailsComponent } from './order-tracking-details.component';

describe('OrderTrackingDetailsComponent', () => {
  let component: OrderTrackingDetailsComponent;
  let fixture: ComponentFixture<OrderTrackingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTrackingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTrackingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
