import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {PaginatorModule} from "primeng/paginator";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ForgotPasswordCompleteForm} from "../../forms/forgot-password-complete.form";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgOptimizedImage,
    NgToastModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  form: any;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute,
                private ngToastService: NgToastService, private router: Router) {
    this.form = new FormGroup({
      passwordToken: new FormControl('', [
        Validators.required
      ]),
      newPassword1: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      newPassword2: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const refreshToken = params['token'];

      this.form.patchValue({passwordToken: refreshToken});
    });
  }


  onSubmit() {
    if (this.form.valid) {
      if (this.form.get('newPassword1')?.value !== this.form.get('newPassword2')?.value) {
        this.passwordMismatch = true;
        return;
      }

      this.passwordMismatch = false;

      const data: ForgotPasswordCompleteForm = this.form.value;

      this.authService.completeForgotPasswordRequest(data).subscribe({
        next: response => {
          // Handle success response
          this.ngToastService.success({
            detail: 'Password reset successfully.',
            summary: 'You are going to be redirected to login',
            duration: 3000,
          });

          // Optionally, you can reset the form after successful submission
          this.form.reset();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        },
        error: error => {
          // Handle error response
          this.ngToastService.error({
            detail: 'Failed to reset password. Please try again later.',
            summary: 'Error',
          });
        }
      });
    } else {
      this.ngToastService.error({
        detail: 'Failed submitting form. Please check your input and try again.',
        summary: 'Input validation failed',
      });
    }
  }
}
