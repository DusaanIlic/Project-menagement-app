import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {NgToastModule} from "ng-angular-popup";
import {PaginatorModule} from "primeng/paginator";

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
export class ForgotPasswordComponent {

}
