import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeamsComponent } from './oeams.component';

describe('OeamsComponent', () => {
  let component: OeamsComponent;
  let fixture: ComponentFixture<OeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
