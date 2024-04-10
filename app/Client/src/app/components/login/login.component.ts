import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {Router} from "@angular/router";
import {MemberService} from "../../services/member.service";

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
  forgotPasswordForm: boolean = false;

  constructor(private authService : AuthService, private memberService: MemberService,
                private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = '* Email and password are required.';
      return;
    }

    this.authService.login(this.email!, this.password!)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        this.errorMessage = err
      });
  }

  toggleForgotPasswordForm() {
    this.forgotPasswordForm = !this.forgotPasswordForm;
  }
}
