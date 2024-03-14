import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdownMenuComponent } from './profile-dropdown-menu.component';

describe('ProfileDropdownMenuComponent', () => {
  let component: ProfileDropdownMenuComponent;
  let fixture: ComponentFixture<ProfileDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDropdownMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
