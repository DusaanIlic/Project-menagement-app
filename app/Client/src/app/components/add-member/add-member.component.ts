import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AddMemberForm } from '../../forms/add-member.form';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgToastModule,
    MatButton,
    MatIcon,
    MatToolbar,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatCardActions
  ],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  roleId: number | null = null;
  availableRoles: any[] = [];

  @Output() memberAdded: EventEmitter<any> = new EventEmitter<any>();
disableSelect: any;

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private memberService: MemberService, private _ngToastService: NgToastService){
    this.loadRoles();
  }

  loadRoles(){
    this.memberService.getRoles().subscribe((roles: any[]) =>{
      this.availableRoles = roles;
    }, error => {
      console.error('Error fetching roles', error);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Member added successfully", duration: 3000});
  }

  addMember(){
    if (!this.firstName || !this.lastName || !this.roleId || !this.email) {
      this._ngToastService.error({
        detail: 'Please fill up inputs',
        summary: 'Adding failed: Inputs cannot be empty'
      });
      return;
    }

    const memberData = {
      firstName: this.firstName,
      lastName: this.lastName,
      roleId: this.roleId,
      email: this.email
    };

    this.memberService.addMember(memberData).subscribe(response => {
      console.log('Member saved successfully:', response);
      this.memberAdded.emit();
      this.showMessage();
      this.closeDialog();
    }, error => {
      if (error.status === 400) {
        this._ngToastService.error({
          detail: 'Error: Bad Request',
          summary: 'Adding failed: Bad data form'
        });
      } else {
        this._ngToastService.error({
          detail: 'Server error',
          summary: 'Adding failed: Server error'
        });
      }
      console.error('Error saving task', error);
    });
  }
}
