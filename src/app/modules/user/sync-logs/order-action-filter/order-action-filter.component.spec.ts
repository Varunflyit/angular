import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionFilterComponent } from './order-action-filter.component';

describe('OrderActionFilterComponent', () => {
  let component: OrderActionFilterComponent;
  let fixture: ComponentFixture<OrderActionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderActionFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderActionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
