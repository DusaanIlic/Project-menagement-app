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

  constructor(private authService : AuthService, private memberService: MemberService,
                private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = '* Email and password are required.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: data => {
        const token = data.token;
        const dto = data.member;

        localStorage.setItem('member-id', dto.id.toString());
        localStorage.setItem('jwt-token', token);

        const member: Member = {
          id: dto.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          roleId: dto.roleId,
          email: dto.email,
          linkedin: dto.linkedin,
          github: dto.github,
          status: dto.status,
          phoneNumber: dto.phoneNumber,
          city: dto.city,
          dateOfBirth: new Date(dto.dateOfBirth),
          dateAdded: new Date(dto.dateAdded)
        };

        this.memberService.setAuthorizedMember(member);

        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = '* Wrong email and password combination';
      }
    });
  }
}
