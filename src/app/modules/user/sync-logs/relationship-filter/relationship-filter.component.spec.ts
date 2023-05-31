import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipFilterComponent } from './relationship-filter.component';

describe('RelationshipFilterComponent', () => {
  let component: RelationshipFilterComponent;
  let fixture: ComponentFixture<RelationshipFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelationshipFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
