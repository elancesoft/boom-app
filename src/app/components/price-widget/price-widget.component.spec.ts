import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceWidgetComponent } from './price-widget.component';

describe('PriceWidgetComponent', () => {
  let component: PriceWidgetComponent;
  let fixture: ComponentFixture<PriceWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
