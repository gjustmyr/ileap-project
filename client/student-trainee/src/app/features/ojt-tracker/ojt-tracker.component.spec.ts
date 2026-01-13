import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjtTrackerComponent } from './ojt-tracker.component';

describe('OjtTrackerComponent', () => {
  let component: OjtTrackerComponent;
  let fixture: ComponentFixture<OjtTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OjtTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OjtTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
