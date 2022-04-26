import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoEmailPdfComponent } from './demo-email-pdf.component';

describe('DemoEmailPdfComponent', () => {
  let component: DemoEmailPdfComponent;
  let fixture: ComponentFixture<DemoEmailPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoEmailPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoEmailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
