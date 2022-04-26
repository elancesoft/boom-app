import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSortComponent } from './price-sort.component';

describe('PriceSortComponent', () => {
  let component: PriceSortComponent;
  let fixture: ComponentFixture<PriceSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
