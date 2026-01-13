import { TestBed } from '@angular/core/testing';

import { CampusesService } from './campuses.service';

describe('CampusesService', () => {
  let service: CampusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
