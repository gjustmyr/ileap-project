import { TestBed } from '@angular/core/testing';

import { OjtHeadService } from './ojt-head.service';

describe('OjtHeadService', () => {
  let service: OjtHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OjtHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
