import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeComponentComponent } from './swipe-component.component';

describe('SwipeComponentComponent', () => {
  let component: SwipeComponentComponent;
  let fixture: ComponentFixture<SwipeComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
