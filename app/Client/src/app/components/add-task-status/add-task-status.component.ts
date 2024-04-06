import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-status',
  standalone: true,
  imports: [FormsModule, CommonModule, NgToastModule],
  templateUrl: './add-task-status.component.html',
  styleUrl: './add-task-status.component.scss'
})
export class AddTaskStatusComponent implements OnInit{
  projectId: any;

  constructor(public dialogRef: MatDialogRef<AddTaskStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private taskService: TaskService, private _ngToastService: NgToastService){}

  ngOnInit() {
    this.projectId = this.data.projectId;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }
}
