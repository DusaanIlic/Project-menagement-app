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
        const member : Member = {
          id: data.member.id,
          firstName: data.member.firstName,
          lastName: data.member.lastName,
          email: data.member.email,
          roleId: data.member.role,
          dateAdded: data.member.dateAdded,
          phoneNumber: data.member.phoneNumber,
          linkedin: data.member.linkedin,
          github: data.member.github,
          status: data.member.status,
          country: data.member.country,
          city: data.member.city,
          dateOfBirth: data.member.dateOfBirth,
        };

        console.log(data);

        const token = data.token;

        localStorage.setItem('auth-member', JSON.stringify(member));
        localStorage.setItem('jwt-token', token);

        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMessage = '* Wrong email and password combination';
      }
    });
  }
}
