import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchPageComponent } from './batch-page.component';

describe('DemoPageComponent', () => {
  let component: BatchPageComponent;
  let fixture: ComponentFixture<BatchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
