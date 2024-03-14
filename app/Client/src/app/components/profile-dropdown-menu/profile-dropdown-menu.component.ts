import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile-dropdown-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-dropdown-menu.component.html',
  styleUrl: './profile-dropdown-menu.component.scss'
})
export class ProfileDropdownMenuComponent {
  @Input() visible : boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
