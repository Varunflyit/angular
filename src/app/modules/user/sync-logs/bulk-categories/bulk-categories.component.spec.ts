import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCategoriesComponent } from './bulk-categories.component';

describe('BulkCategoriesComponent', () => {
  let component: BulkCategoriesComponent;
  let fixture: ComponentFixture<BulkCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
