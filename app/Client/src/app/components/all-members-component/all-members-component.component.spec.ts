import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMembersComponentComponent } from './all-members-component.component';

describe('AllMembersComponentComponent', () => {
  let component: AllMembersComponentComponent;
  let fixture: ComponentFixture<AllMembersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMembersComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllMembersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
