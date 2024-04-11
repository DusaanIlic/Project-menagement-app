import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Member } from '../../models/member';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [NgxEditorModule, FormsModule, CommonModule, NgToastModule],
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
  selectedMember: number | null = null;
  addedMembers: string[] = [];

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
      projectId: this.projectId,
      deadline: this.deadline,
      assignedMemberIds : []
    };

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

  addSelectedMember() {
    // Pronalazimo odabranog člana iz niza projectMembers
    const member = this.projectMembers.find(member => member.id === this.selectedMember);
    // Ako smo pronašli člana
    if (member) {
        // Dodajemo ime i prezime odabranog člana u niz addedMembers
        console.log(this.addedMembers);
        this.addedMembers.push(`${member.firstName} ${member.lastName}`);

    }
}
}
