import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxEditorModule, Editor, Validators } from 'ngx-editor';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Member } from '../../models/member';
import {MatOption, MatSelect, MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [NgxEditorModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, NgToastModule, MatButton,
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
    MatCardActions,
    ReactiveFormsModule,
    MatError],
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
  taskForm!: FormGroup;

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();


  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
              private taskService: TaskService, private _ngToastService: NgToastService, private fb: FormBuilder) {}

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.getProjectMembers();

    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      deadline: ['', Validators.required],
      assignedMembers: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]]
    });
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
    if (this.taskForm.invalid) {
      this._ngToastService.error({
        detail: 'Please fill up inputs',
        summary: 'Adding failed: Inputs cannot be empty'
      });
      return;
    }

    const taskData = this.taskForm.value;
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
