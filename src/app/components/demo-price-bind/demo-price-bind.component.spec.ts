import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPriceBindComponent } from './demo-price-bind.component';

describe('DemoPriceBindComponent', () => {
  let component: DemoPriceBindComponent;
  let fixture: ComponentFixture<DemoPriceBindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPriceBindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPriceBindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
