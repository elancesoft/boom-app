import { TestBed } from '@angular/core/testing';

import { OlarkService } from './olark.service';

describe('OlarkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OlarkService = TestBed.get(OlarkService);
    expect(service).toBeTruthy();
  });
});
