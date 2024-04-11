import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {Router} from "@angular/router";
import {MemberService} from "../../services/member.service";
import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    FormsModule,
    NgToastModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage: string | undefined;
  email: string | undefined;
  password: string | undefined;
  showForgotPasswordForm: boolean = false;

  forgotPasswordForm: any;

  constructor(private authService : AuthService, private memberService: MemberService,
                private router: Router, private _ngToastService: NgToastService) {}

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });
  }

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
    this.showForgotPasswordForm = !this.showForgotPasswordForm;
  }

  forgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {

    } else {
      this._ngToastService.error({
        detail: 'Form is not valid',
        summary: 'Please enter a correct email',
        duration: 2000
      });
    }
  }
}
