import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkFindReplaceComponent } from './bulk-find-replace.component';

describe('BulkFindReplaceComponent', () => {
  let component: BulkFindReplaceComponent;
  let fixture: ComponentFixture<BulkFindReplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkFindReplaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkFindReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
