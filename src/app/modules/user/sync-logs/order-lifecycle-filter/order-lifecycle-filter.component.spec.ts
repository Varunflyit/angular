import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLifecycleFilterComponent } from './order-lifecycle-filter.component';

describe('OrderLifecycleFilterComponent', () => {
  let component: OrderLifecycleFilterComponent;
  let fixture: ComponentFixture<OrderLifecycleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLifecycleFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLifecycleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
