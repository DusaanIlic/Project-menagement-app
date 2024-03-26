import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GantogramComponent } from './gantogram.component';

describe('GantogramComponent', () => {
  let component: GantogramComponent;
  let fixture: ComponentFixture<GantogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GantogramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GantogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
