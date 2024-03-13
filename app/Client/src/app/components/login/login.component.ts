import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

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

  constructor(private authService : AuthService) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = '* Email and password are required.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: data => {
        localStorage.setItem('jwt-token', data.token);
        console.log("logged in");
      },
      error: err => {
        this.errorMessage = '* Wrong email and password combination';
      }
    });
  }
}
