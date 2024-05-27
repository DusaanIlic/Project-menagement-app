import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatOption, MatSelect} from "@angular/material/select";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {taskComment} from "../../models/taskComment";

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
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCheckbox, MatError, MatFormField, MatIcon, MatInput, MatLabel, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatTab, MatTabGroup, MatToolbar, ReactiveFormsModule, MatButtonToggle, MatSelect, MatOption],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit{

    editing : boolean = false;
    project : any;
    activitiesForThisTask : taskActivity[] = [];
    activities : taskActivity[] = [];
    editor: Editor = new Editor;
    taskActivityDesc: any;
    description: any;
    selectedType: any;
    show: any;
    showEditorForDesc: boolean = false;
    allTypes : any
    taskActivityGroup! : FormGroup;
    taskActivityComment! : FormGroup;
    taskComments : taskComment[] = [];

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>,
              @Inject(MAT_DIALOG_DATA) public task: Task,
              private tService : TaskService,
              private mService : MemberService,
              private _ngToastService: NgToastService,
              private sanitizer: DomSanitizer,
              private pService: ProjectServiceGet,
              private fb: FormBuilder) { }

  ngOnInit()
  {
    this.taskActivityGroup = this.fb.group({
      description: ['', Validators.required],
      taskActivityPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      taskActivityTypeId: ['', Validators.required],
      taskId : [this.task.taskId]
    });

    this.taskActivityComment = this.fb.group({
      taskId: [this.task.taskId],
      text: ['', Validators.required],
    })

    this.show = 'overview'
    this.tService.getTaskActivityType().subscribe(data =>{
      this.allTypes = data;
    });

    this.fetchTaskActivities();
  }

  fetchTaskActivities() : void
  {
    this.tService.getTaskActivities().pipe(
      switchMap(taskActivities =>{
        this.activities = taskActivities
        console.log(taskActivities)
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

                this.activities[i].comment = this.sanitizer.bypassSecurityTrustHtml(this.activities[i].comment) as string;

                this.activitiesForThisTask.push(this.activities[i])
              }

            }
            console.log(this.activities)
            return this.activities;
          })
        );
      })
    ).subscribe()

    this.fetchTaskComments();
  }

  fetchTaskComments()
  {
    this.tService.getTaskCommentsByTaskId(this.task.taskId).subscribe((data : taskComment[]) =>{
       this.taskComments = data;
    })
  }



  closeDialog(): void {
    this.dialogRef.close();
  }

  saveActivity()
  {
    console.log(this.taskActivityGroup.value)
    if(this.taskActivityGroup.valid)
    {
      const taskActivity = this.taskActivityGroup.value;

      this.tService.saveTaskActivity(taskActivity).subscribe(
        {
          next : next =>{console.log(next); this.fetchTaskActivities()},
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

  assignRemove(event : any, memberId: number)
  {
    console.log(event.target.checked) // If true - assign if false - remove
    const membersList = [memberId];
    console.log(membersList)


    if(event.target.checked) // assign
    {
      this.tService.assignMembersToTask(this.task.taskId, membersList).subscribe({
        next : data =>{
          console.log("Assigned to task!");
        },
        error : error =>{
          console.log("Error assigning to task!");
        }
      })
    }
    else //remove
    {
      this.tService.removeMemberFromTask(this.task.taskId, memberId ).subscribe({
        next : data =>{
          console.log("Removed from task!");
        },
        error : error =>{
          console.log("Error removing from task!");
        }
      })
    }
  }

  checkIfAssignedToTask(memberId : number) : boolean
  {
    for(let i=0;i<this.task.assignedMembers.length;i++)
    {
      if(this.task.assignedMembers[i].id == memberId)
        return true;
    }
    return false;
  }

    protected readonly environment = environment;
    taskName: string = "";
    taskDescription : string = "";
    taskDeadline : Date = new Date();


  editMode(forEdit: string)
  {
    if(forEdit == 'taskname')
      this.editing = true;
  }

  changeTaskname() {
    this.tService.changeTaskNameDescriptionDeadline(this.task.taskId, this.taskName ,this.task.taskDescription, this.task.deadline).subscribe();
    this.editing = false;
  }

  saveComment()
  {
    if(this.taskActivityComment.valid)
    {
      const taskComment = this.taskActivityComment.value
      this.tService.saveTaskComment(taskComment).subscribe({
        next : data =>{console.log(data)},
        error : error => {console.log(error)}
      })
    }
    else
      this.taskActivityComment.markAllAsTouched();
  }
}

