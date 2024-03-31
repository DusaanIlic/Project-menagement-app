import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  constructor(public dialogRef: MatDialogRef<AddTaskComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
