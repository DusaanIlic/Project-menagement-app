import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberUpdateComponent } from './member-update.component';

describe('MemberUpdateComponent', () => {
  let component: MemberUpdateComponent;
  let fixture: ComponentFixture<MemberUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
