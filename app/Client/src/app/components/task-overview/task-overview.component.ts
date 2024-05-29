import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef, EventEmitter,
  Inject,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { taskActivity } from '../../models/taskActivity';
import { RouterModule } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Task } from '../../models/task';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { TaskService } from '../../services/task.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MemberService } from '../../services/member.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {ProjectServiceGet} from "../../services/project.service";
import {environment} from "../../../environments/environment";
import {concatMap, forkJoin, Subscription, switchMap} from "rxjs";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatOption, MatSelect} from "@angular/material/select";
import {taskComment} from "../../models/taskComment";
import {Permission} from "../../models/permission";
import {RoleService} from "../../services/role.service";
import {PermissionService} from "../../services/permission.service";
import {ProjectPermission} from "../../enums/project-permissions.enum";
import {HasGlobalPermissionPipe} from "../../pipes/has-global-permission.pipe";
import {HasProjectPermissionPipe} from "../../pipes/has-project-permission.pipe";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {ProjectStatus} from "../../models/project-status";
import {TaskStatus} from "../../models/task-status";
import {taskPriority} from "../../models/taskPriority";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    FormsModule,
    NgxEditorModule,
    NgToastModule,
    NgToastModule,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatAnchor,
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCheckbox, MatError, MatFormField, MatIcon, MatInput, MatLabel, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatTab, MatTabGroup, MatToolbar, ReactiveFormsModule, MatButtonToggle, MatSelect, MatOption, MatCardFooter, HasProjectPermissionPipe, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatHint, MatSuffix],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit, DoCheck{

    loggedUserId: any;
    editing : boolean = false;
    project : any;
    description: any;
    show: any;
    allTypes : any
    selectedStatus : any;
    selectedPriority : any;
    today: Date = new Date();
    protected readonly environment = environment;
    @Output() taskModified: EventEmitter<any> = new EventEmitter<any>();


    taskActivityGroup! : FormGroup;
    taskActivityComment! : FormGroup;
    taskNameForm!: FormGroup;
    taskDescriptionForm!: FormGroup;
    taskDeadlineForm!: FormGroup;
    taskStatusForm!: FormGroup;
    taskPriorityForm! : FormGroup;


    taskComments : taskComment[] = [];
    permissions : Permission[] = [];
    taskStatuses : TaskStatus[] = [];
    activitiesForThisTask : taskActivity[] = [];
    activities : taskActivity[] = [];
    taskPriorities : taskPriority[] = [];


    readonly ProjectPermission = ProjectPermission;
    @ViewChild('scrollableDiv') private scrollableDiv!: ElementRef;

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>,
              @Inject(MAT_DIALOG_DATA) public task: Task,
              private tService : TaskService,
              private mService : MemberService,
              private _ngToastService: NgToastService,
              private sanitizer: DomSanitizer,
              private pService: ProjectServiceGet,
              private fb: FormBuilder,
              private rService : RoleService,
              private permService : PermissionService,
              private snackBar : MatSnackBar) { }

  ngDoCheck(): void
  {
      if(this.scrollableDiv != undefined)
        this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
  }

  ngOnInit()
  {
    this.loggedUserId = localStorage.getItem('authenticated-member-id');

    this.fetchTaskActivityStatuses();
    this.fetchTaskActivities();
    this.fetchTaskStatuses();
    this.fetchTaskComments();
    this.fetchTaskPriorityStatuses();


    this.taskActivityGroup = this.fb.group({
      description: ['', Validators.required],
      percentageComplete: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(100|[1-9]?[0-9])%?$')]],
      taskActivityTypeId: ['', Validators.required],
      taskId : [this.task.taskId]
    });

    this.taskNameForm = this.fb.group({
      deadline: [this.task.deadline],
      taskDescription: [this.task.taskDescription],
      taskName : [this.task.taskName, Validators.required],
    })

    this.taskDescriptionForm = this.fb.group({
      deadline: [this.task.deadline],
      taskDescription: [this.task.taskDescription, Validators.required],
      taskName : [this.task.taskName],
    })


    this.taskDeadlineForm = this.fb.group({
      deadline: [this.task.deadline, Validators.required],
      taskDescription: [this.task.taskDescription],
      taskName : [this.task.taskName],
    })

    this.taskActivityComment = this.fb.group({
      taskId: [this.task.taskId],
      text: ['', Validators.required],
    })

    this.taskStatusForm = this.fb.group({
      statusId: [this.task.taskStatusId, Validators.required]
    })

    this.taskPriorityForm = this.fb.group({
      priorityId: [this.task.taskPriorityId, Validators.required]
    })

    this.show = 'overview';


  }//NGONINITEND



  fetchTaskActivityStatuses()
  {
    this.tService.getTaskActivityType().subscribe(data =>{
      this.allTypes = data;
    });
  }

  fetchTaskStatuses()
  {
    this.pService.getAllTaskStatusesOnProject(this.task.projectId).subscribe((statuses : TaskStatus[]) =>{
      this.taskStatuses = statuses;
    })
  }

  fetchTaskActivities() : void
  {
    this.tService.getTaskActivities().pipe(
      switchMap(taskActivities =>{
        this.activities = taskActivities
        this.activitiesForThisTask = [];

        const observables = [];

        for (let i = 0; i < taskActivities.length; i++) {
          const memberObservable = this.mService.getMemberById(this.activities[i].workerId);
          const taskObservable = this.tService.getTaskActivityName(this.activities[i].taskActivityTypeId);

          observables.push(memberObservable);
          observables.push(taskObservable);
        }

        return forkJoin(observables).pipe(
          switchMap((results : any) => {

            // Use results to update tasks
            for (let i = 0; i < taskActivities.length; i++) {

              if(this.activities[i].taskId == this.task.taskId)
              {
                this.activities[i].differenceH = Math.trunc((new Date().getTime() - new Date(this.activities[i].dateModify).getTime()) / (1000 * 3600));
                this.activities[i].differenceM = Math.trunc((new Date().getTime() - new Date(this.activities[i].dateModify).getTime()) / (1000 * 60));

                const memberIndex = i * 2;
                this.activities[i].memberName = results[memberIndex].firstName + " " + results[memberIndex].lastName;

                const taskActivityIndex = memberIndex + 1;
                this.activities[i].taskActivityName = results[taskActivityIndex].taskActivityTypeName;

                this.activitiesForThisTask.push(this.activities[i])
              }

            }
            return this.activities;
          })
        );
      })
    ).subscribe()


  }

  fetchTaskComments()
  {
    this.tService.getTaskCommentsByTaskId(this.task.taskId).subscribe((data : taskComment[]) =>{
       this.taskComments = data;
    })
  }

  fetchTaskPriorityStatuses()
  {
    this.tService.getTaskPriorities().subscribe((priorities : taskPriority[]) =>{

      this.taskPriorities = priorities;

      console.log(this.taskPriorities);
    })
  }

  updateTaskInfo()
  {
    this.tService.getTaskById(this.task.taskId).subscribe((task : Task) =>{
      this.task = task;
    })
  }




  closeDialog(): void {
    this.dialogRef.close();
  }

  saveActivity()
  {
    if(this.taskActivityGroup.valid)
    {
      const taskActivity = this.taskActivityGroup.value;
      console.log(taskActivity.percentageComplete)

      this.tService.saveTaskActivity(taskActivity).subscribe(
        {
          next : next =>{ this.fetchTaskActivities()},
          error : error =>{console.log(error)}
        }
      );
    }
    else
      this.taskActivityGroup.markAllAsTouched();
  }



  deleteTaskActivity(taskAct: taskActivity) {
    this.tService.deleteTaskActivity(taskAct.taskActivityId).subscribe(
      {
        next : data =>
          {
            this.fetchTaskActivities()
          },
        error : error =>
          {
          }
      }
    );
    }

  saveComment()
  {
    if(this.taskActivityComment.valid)
    {
      const taskComment = this.taskActivityComment.value
      this.tService.saveTaskComment(taskComment).subscribe({
        next : data =>{ this.fetchTaskComments()},
        error : error => {console.log(error)}
      })
    }
    else
      this.taskActivityComment.markAllAsTouched();
  }


  editTaskname()
  {
    if(this.taskNameForm.valid)
    {
      const taskData = this.taskNameForm.value
      console.log(taskData)
      this.tService.changeTaskNameDescriptionDeadline(this.task.taskId, taskData).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task name!', 'Close', { duration: 3000 }); this.taskModified.emit();},
        error : error => {console.log(error); this.snackBar.open('Failed to change task name!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskNameForm.markAllAsTouched();
  }

  editTaskdescription()
  {
    if(this.taskDescriptionForm.valid)
    {
      const taskData = this.taskDescriptionForm.value
      console.log(taskData)
      this.tService.changeTaskNameDescriptionDeadline(this.task.taskId, taskData).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task description!', 'Close', { duration: 3000 }); this.taskModified.emit();},
        error : error => {console.log(error); this.snackBar.open('Failed to change task description!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskDescriptionForm.markAllAsTouched();
  }

  editTaskdeadline()
  {
    if(this.taskDeadlineForm.valid)
    {
      const taskData = this.taskDeadlineForm.value
      const utcDate = new Date(Date.UTC(this.taskDeadlineForm.value.deadline.getFullYear(), this.taskDeadlineForm.value.deadline.getMonth(), this.taskDeadlineForm.value.deadline.getDate()));
      taskData.deadline = utcDate;
      this.tService.changeTaskNameDescriptionDeadline(this.task.taskId, taskData).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task deadline!', 'Close', { duration: 3000 }); this.taskModified.emit();},
        error : error => {console.log(error); this.snackBar.open('Failed to change task deadline!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskDeadlineForm.markAllAsTouched();
  }

  editTaskstatus()
  {
    if(this.taskStatusForm.valid)
    {
      const taskData = this.taskStatusForm.value
      console.log(taskData)
      this.tService.updateTaskStatus(this.task.taskId, taskData.statusId).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task status!', 'Close', { duration: 3000 }); this.taskModified.emit();},
        error : error => {console.log(error); this.snackBar.open('Failed to change task status!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskStatusForm.markAllAsTouched();
  }

  editTaskpriority()
  {
    if(this.taskPriorityForm.valid)
    {
      const taskData = this.taskPriorityForm.value
      console.log(taskData)
      this.tService.changeTaskPriority(this.task.taskId, taskData.priorityId).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task priority!', 'Close', { duration: 3000 }); this.taskModified.emit();},
        error : error => {console.log(error); this.snackBar.open('Failed to change task priority!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskPriorityForm.markAllAsTouched();
  }
}


