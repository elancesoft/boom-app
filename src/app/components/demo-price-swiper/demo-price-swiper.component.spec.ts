import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPriceSwiperComponent } from './demo-price-swiper.component';

describe('DemoPriceSwiperComponent', () => {
  let component: DemoPriceSwiperComponent;
  let fixture: ComponentFixture<DemoPriceSwiperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPriceSwiperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPriceSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
