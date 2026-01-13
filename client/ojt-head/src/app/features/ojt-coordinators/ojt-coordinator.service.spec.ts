import { TestBed } from '@angular/core/testing';

import { OjtCoordinatorService } from './ojt-coordinator.service';

describe('OjtCoordinatorService', () => {
  let service: OjtCoordinatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OjtCoordinatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
