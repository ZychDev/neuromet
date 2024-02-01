import { TestBed } from '@angular/core/testing';

import { PdfDisplayService } from './pdf-display.service';

describe('PdfDisplayService', () => {
  let service: PdfDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
