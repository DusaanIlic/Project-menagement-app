import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string | undefined;
  email: string | undefined;
  password: string | undefined;

  constructor(private authService : AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = '* Email and password are required.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: data => {
        const token = data.token;
        const id = data.id;

        localStorage.setItem('member-id', id);
        localStorage.setItem('jwt-token', token);

        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMessage = '* Wrong email and password combination';
      }
    });
  }
}
