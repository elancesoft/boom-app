import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceLoaderComponent } from './price-loader.component';

describe('PriceLoaderComponent', () => {
  let component: PriceLoaderComponent;
  let fixture: ComponentFixture<PriceLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
