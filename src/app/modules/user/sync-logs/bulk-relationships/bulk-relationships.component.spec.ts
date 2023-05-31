import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkRelationshipsComponent } from './bulk-relationships.component';

describe('BulkRelationshipsComponent', () => {
  let component: BulkRelationshipsComponent;
  let fixture: ComponentFixture<BulkRelationshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkRelationshipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
