import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Member } from '../../models/member';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [NgxEditorModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, NgToastModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnDestroy{
  editor: Editor = new Editor;
  html = '';
  taskName: string = '';
  taskDescription: string = '';
  deadline: Date | null = null;
  projectId: number | null = null;
  taskPriority: number | null = null;
  projectMembers: Member[] = [];
  selectedMembers: number[] = [];
  assignedMembersIds: number[] = [];
  members = new FormControl('');

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();


  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private taskService: TaskService, private _ngToastService: NgToastService) {}

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.getProjectMembers();
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
}

  saveTask(){
    const taskData = {
      taskName: this.taskName,
      taskDescription: this.html,
      deadline: this.deadline,
      projectId: this.projectId,
      assignedMemberIds: this.selectedMembers,
      taskPriorityId: this.taskPriority
    };
    //console.log(this.assignedMembersIds);
    console.log(taskData);
    this.taskService.saveTask(taskData).subscribe(response => { 
      console.log('Task saved successfully:', response);
      this.taskAdded.emit();
      this.showMessage();
      this.closeDialog();
    }, error => {
      console.error('Error saving task', error);
    });
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }

  getProjectMembers() {
    if (this.projectId) {
      this.taskService.getProjectMembers(this.projectId).subscribe(
        (data: Member[]) => {
          this.projectMembers = data;
          console.log(data);
        },
        (error) => {
          console.log('Error fetching project members:', error);
        }
      );
    }
  }

  toggleMember(event: MatSelectChange) {
    this.selectedMembers = event.value;
    this.assignedMembersIds = this.selectedMembers;
  }

}
