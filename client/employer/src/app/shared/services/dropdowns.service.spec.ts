import { TestBed } from '@angular/core/testing';
import { DropdownsService } from './dropdowns.service';

describe('DropdownsService', () => {
  let service: DropdownsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
