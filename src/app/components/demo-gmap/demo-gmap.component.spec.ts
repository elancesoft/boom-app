import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoGmapComponent } from './demo-gmap.component';

describe('DemoGmapComponent', () => {
  let component: DemoGmapComponent;
  let fixture: ComponentFixture<DemoGmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoGmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoGmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
