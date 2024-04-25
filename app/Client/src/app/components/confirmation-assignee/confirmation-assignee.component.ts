import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-confirmation-assignee',
  standalone: true,
  imports: [NgToastModule],
  templateUrl: './confirmation-assignee.component.html',
  styleUrl: './confirmation-assignee.component.scss'
})
export class ConfirmationAssigneeComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationAssigneeComponent>, private _ngToastService: NgToastService, private taskService: TaskService,  @Inject(MAT_DIALOG_DATA) public data: any){}

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Assignee deleted successfully", duration: 3000});
  }

  confirmDelete(): void{
    this.dialogRef.close(this.data);
  }
 

}
