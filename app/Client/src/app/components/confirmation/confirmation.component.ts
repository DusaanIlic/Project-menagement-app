import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [NgToastModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

constructor(public dialogRef: MatDialogRef<ConfirmationComponent>, private taskService: TaskService,  @Inject(MAT_DIALOG_DATA) public data: any){}

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void{
    this.dialogRef.close(this.data);
  }

}
