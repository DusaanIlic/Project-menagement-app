import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AddMemberForm } from '../../forms/add-member.form';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [FormsModule, CommonModule, NgToastModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  roleId: number | null = null;

  @Output() memberAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private memberService: MemberService, private _ngToastService: NgToastService){}


  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }

  addMember(){
    const memberData = {
      firstName: this.firstName,
      lastName: this.lastName,
      roleId: this.roleId,
      email: this.email
    };

    this.memberService.addMember(memberData).subscribe(response => {
      console.log('Task saved successfully:', response);
      this.memberAdded.emit();
      this.showMessage();
      this.closeDialog();
    }, error => {
      console.error('Error saving task', error);
    });
  }
}
