import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPageEmailModalComponent } from './demo-page-email-modal.component';

describe('DemoPageEmailModalComponent', () => {
  let component: DemoPageEmailModalComponent;
  let fixture: ComponentFixture<DemoPageEmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPageEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPageEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
