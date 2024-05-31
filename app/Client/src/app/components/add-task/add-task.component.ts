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
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task',
  standalone: true,
    imports: [NgxEditorModule, MatFormFieldModule, MatSelectModule, FormsModule,  CommonModule, NgToastModule, MatButton,
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
        MatError, MatDatepicker, MatDatepickerInput, MatDatepickerToggle],
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
  taskPriorities: any;
  projectMembers: Member[] = [];
  selectedMembers: number[] = [];
  assignedMembersIds: number[] = [];
  members = new FormControl('');
  taskForm!: FormGroup;
  today = new Date();

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();


  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private taskService: TaskService,  private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.getProjectMembers();

    this.taskService.getTaskPriorities().subscribe({
      next: data => {
        this.taskPriorities = data;
        console.log(data);
      },
      error: error => {
        console.log('failed fetching task priorities');
      }
    });

    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      deadline: ['', Validators.required],
      taskPriorityId: ['', Validators.required],
      assignedMemberIds: [[], [Validators.required]],
      taskDescription: ['', [Validators.required]],
      projectId: [this.projectId]
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
    console.log(this.taskForm.value);

    const taskData = this.taskForm.value;

    console.log(taskData);

    //console.log(this.assignedMembersIds);
    console.log(taskData);
    this.taskService.saveTask(taskData).subscribe(response => {
      console.log('Task saved successfully:', response);
      this.taskAdded.emit();
      this.snackBar.open('Task added successfully.', 'Close', {
        duration: 3000,
      });
      this.closeDialog();
    }, error => {
      console.error('Error saving task', error);
    });
  }


  getProjectMembers() {
    if (this.projectId) {
      this.taskService.getProjectMembers(this.projectId).subscribe({
        next: (data: Member[]) => {
          this.projectMembers = data;
          console.log(this.projectMembers);
        },
        error: error => {
          console.log('Error fetching project members:', error);
        }
      });
    }
  }

  toggleMember(event: MatSelectChange) {
    this.selectedMembers = event.value;
    this.assignedMembersIds = this.selectedMembers;
  }

}
