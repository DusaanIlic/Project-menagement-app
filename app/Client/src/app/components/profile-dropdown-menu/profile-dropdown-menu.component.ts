import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown-menu.component.html',
  styleUrl: './profile-dropdown-menu.component.scss'
})
export class ProfileDropdownMenuComponent {
  @Input() visible : boolean = false;
}
