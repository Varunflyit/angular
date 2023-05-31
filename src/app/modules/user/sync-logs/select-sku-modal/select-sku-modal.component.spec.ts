import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSkuModalComponent } from './select-sku-modal.component';

describe('SelectSkuModalComponent', () => {
  let component: SelectSkuModalComponent;
  let fixture: ComponentFixture<SelectSkuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSkuModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSkuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
