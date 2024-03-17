import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MemberService} from "../../services/member.service";
import {AddMemberForm} from "../../forms/add-member.form";

@Component({
    selector: 'app-add-member',
    standalone: true,
    templateUrl: './add-member.component.html',
    styleUrl: './add-member.component.scss',
    imports: [FormsModule]
})
export class AddMemberComponent {
  formData: AddMemberForm = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    role: '',
    password: ''
  };

  constructor(private memberService: MemberService) { }

  public onClick(){
    this.formData.fullName = this.formData.firstName + this.formData.lastName;

    console.log(this.formData.role);

    this.memberService.addMember(this.formData).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}


