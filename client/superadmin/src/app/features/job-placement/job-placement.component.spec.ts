import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPlacementComponent } from './job-placement.component';

describe('JobPlacementComponent', () => {
  let component: JobPlacementComponent;
  let fixture: ComponentFixture<JobPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPlacementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
