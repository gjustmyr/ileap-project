import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjtHeadComponent } from './ojt-head.component';

describe('OjtHeadComponent', () => {
  let component: OjtHeadComponent;
  let fixture: ComponentFixture<OjtHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OjtHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OjtHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
