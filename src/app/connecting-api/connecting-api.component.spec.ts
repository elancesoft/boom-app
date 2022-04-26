import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingAPIComponent } from './connecting-api.component';

describe('ConnectingAPIComponent', () => {
  let component: ConnectingAPIComponent;
  let fixture: ComponentFixture<ConnectingAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectingAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectingAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
