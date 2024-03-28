import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent {

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }


}
