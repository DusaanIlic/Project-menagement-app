import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";

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

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = "* Email and password are required.";
      return;
    }

    console.log(this.email, this.password);
  }

  /* Cekam bek za dalje */
}
