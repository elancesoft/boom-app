import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPriceInfoComponent } from './demo-price-info.component';

describe('DemoPriceInfoComponent', () => {
  let component: DemoPriceInfoComponent;
  let fixture: ComponentFixture<DemoPriceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPriceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPriceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
