import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAttributesComponent } from './bulk-attributes.component';

describe('BulkAttributesComponent', () => {
  let component: BulkAttributesComponent;
  let fixture: ComponentFixture<BulkAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAttributesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
