import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceDetailsModalComponent } from './price-details-modal.component';

describe('PriceDetailsModalComponent', () => {
  let component: PriceDetailsModalComponent;
  let fixture: ComponentFixture<PriceDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
