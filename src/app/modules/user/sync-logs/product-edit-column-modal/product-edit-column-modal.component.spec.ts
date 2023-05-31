import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditColumnModalComponent } from './product-edit-column-modal.component';

describe('ProductEditColumnModalComponent', () => {
  let component: ProductEditColumnModalComponent;
  let fixture: ComponentFixture<ProductEditColumnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEditColumnModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductEditColumnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
