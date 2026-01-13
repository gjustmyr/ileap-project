import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjtCoordinatorsComponent } from './ojt-coordinators.component';

describe('OjtCoordinatorsComponent', () => {
  let component: OjtCoordinatorsComponent;
  let fixture: ComponentFixture<OjtCoordinatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OjtCoordinatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OjtCoordinatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
