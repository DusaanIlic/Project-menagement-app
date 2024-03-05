import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsComponentComponent } from './all-projects-component.component';

describe('AllProjectsComponentComponent', () => {
  let component: AllProjectsComponentComponent;
  let fixture: ComponentFixture<AllProjectsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProjectsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllProjectsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
