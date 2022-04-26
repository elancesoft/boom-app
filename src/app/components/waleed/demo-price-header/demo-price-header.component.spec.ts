import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPriceHeaderComponent } from './demo-price-header.component';

describe('DemoPriceHeaderComponent', () => {
  let component: DemoPriceHeaderComponent;
  let fixture: ComponentFixture<DemoPriceHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPriceHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPriceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
