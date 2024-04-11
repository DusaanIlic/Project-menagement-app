import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-task-status',
  standalone: true,
  imports: [FormsModule, CommonModule, NgToastModule],
  templateUrl: './add-task-status.component.html',
  styleUrl: './add-task-status.component.scss'
})
export class AddTaskStatusComponent implements OnInit{
  taskStatusName: string = '';
  projectId!: number;

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() taskStatusAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<AddTaskStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private taskService: TaskService, private _ngToastService: NgToastService, private route: ActivatedRoute){}

  ngOnInit() {
    this.projectId = this.data.projectId;
  }

  getProjectIdFromRoute(){
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }

  saveTaskStatus(): void {
    if (!this.taskStatusName.trim()) {
      this._ngToastService.error({ detail: 'Status name cannot be empty.', duration: 3000 });
      return;
    }

    this.taskService.addTaskStatus(this.projectId, this.taskStatusName).subscribe(
      (response) => {
        this.showMessage();
        this.taskStatusAdded.emit();
        this.dialogRef.close(response); 
      },
      (error) => {
        console.error('Error adding task status:', error);
        this._ngToastService.error({ detail: 'Error adding task status. Please try again.', duration: 3000 });
      }
    );
  }

}
