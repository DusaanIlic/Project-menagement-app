import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationAssigneeComponent } from './confirmation-assignee.component';

describe('ConfirmationAssigneeComponent', () => {
  let component: ConfirmationAssigneeComponent;
  let fixture: ComponentFixture<ConfirmationAssigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationAssigneeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationAssigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
