import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExportModalComponent } from './product-export-modal.component';

describe('ProductExportModalComponent', () => {
  let component: ProductExportModalComponent;
  let fixture: ComponentFixture<ProductExportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
