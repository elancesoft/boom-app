import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperContainerComponent } from './swiper-container.component';

describe('SwiperContainerComponent', () => {
  let component: SwiperContainerComponent;
  let fixture: ComponentFixture<SwiperContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
