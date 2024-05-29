import {CommonModule, NgOptimizedImage} from '@angular/common';
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
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {Member} from "../../models/member";
import {Role} from "../../models/role";
import {SignalRService} from "../../services/signal-r.service";
import {AvatarComponent} from "../avatar/avatar.component";




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
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCheckbox, MatError, MatFormField, MatIcon, MatInput, MatLabel, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatTab, MatTabGroup, MatToolbar, ReactiveFormsModule, MatButtonToggle, MatSelect, MatOption, MatCardFooter, HasProjectPermissionPipe, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatHint, MatSuffix, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatPaginator, MatRow, MatRowDef, MatSort, MatSortHeader, MatTable, MatHeaderCellDef, AvatarComponent, NgOptimizedImage],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})



export class TaskOverviewComponent implements OnInit, DoCheck{

    loggedUserId: any;
    project : any;
    description: any;
    show: any;
    allTypes : any
    selectedStatus : any;
    selectedPriority : any;
    today: Date = new Date();
    protected readonly environment = environment;
    @Output() taskModified: EventEmitter<any> = new EventEmitter<any>();
    taskLeaderId : any;
    waiting: boolean = false;
    @ViewChild(MatSort)sort: any;
    @ViewChild(MatPaginator) paginator: any;
    onlineAssignees: Set<number> = new Set<number>();



    taskActivityGroup! : FormGroup;
    taskActivityComment! : FormGroup;
    taskNameForm!: FormGroup;
    taskDescriptionForm!: FormGroup;
    taskDeadlineForm!: FormGroup;
    taskStatusForm!: FormGroup;
    taskPriorityForm! : FormGroup;
    taskLeaderFormGroup!: FormGroup;


    taskComments : taskComment[] = [];
    permissions : Permission[] = [];
    taskStatuses : TaskStatus[] = [];
    activitiesForThisTask : taskActivity[] = [];
    activities : taskActivity[] = [];
    taskPriorities : taskPriority[] = [];
    membersOnThisTask : Member[] = []
    allMembersOnProject : Member[] = [];
    projectRoles: Role[] = [];



    readonly ProjectPermission = ProjectPermission;
    @ViewChild('scrollableDiv') private scrollableDiv!: ElementRef;

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>,
              @Inject(MAT_DIALOG_DATA) public task: Task,
              private tService : TaskService,
              private mService : MemberService,
              private pService: ProjectServiceGet,
              private fb: FormBuilder,
              private snackBar : MatSnackBar,
              private _liveAnnouncer: LiveAnnouncer,
              private signalRService: SignalRService) { }

  ngDoCheck(): void
  {
      if(this.scrollableDiv != undefined)
        this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
  }

  ngOnInit()
  {
    this.fetchMembersOnTask();
    this.loggedUserId = localStorage.getItem('authenticated-member-id');

    this.fetchTaskActivityStatuses();
    this.fetchTaskActivities();
    this.fetchTaskStatuses();
    this.fetchTaskComments();
    this.fetchTaskPriorityStatuses();



    this.signalRService.getConnectedMemberIds().subscribe({
      next: data => {
        this.onlineAssignees = data;
      },
      error: err => {
        console.log('failed fetching online members')
      }
    });

    this.pService.getAllProjectRoles(this.task.projectId).subscribe({
      next: data => {
        this.projectRoles = data;
      },
      error: err => {
        console.log('failed fetching project roles');
      }
    });


    this.taskLeaderFormGroup = this.fb.group({
      taskId: [this.task.taskId],
      newTaskLeaderId: ['', Validators.required]
    })

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











  search(event: any): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  isMemberTeamLeader(mId : number) : boolean
  {
    if(mId === this.taskLeaderId)
      return true;
    return false
  }

  assignRemove(event : any, memberId: number)
  {
    console.log(event)
    const membersList = [memberId];


    if(event) // assign
    {
      this.waiting = true;
      this.tService.assignMembersToTask(this.task.taskId, membersList).subscribe({
        next : data =>{
          this.snackBar.open('Successfully assigned member to task!', 'Close', { duration: 3000 });
          this.waiting = false;
          this.fetchMembersOnTask()
        },
        error : error =>{
          this.snackBar.open('Failed assigning member to task!', 'Close', { duration: 3000 });
          this.waiting = false;
        }
      })
    }
    else //remove
    {
      this.waiting = true;
      this.tService.removeMembersFromTask(this.task.taskId, memberId).subscribe({
        next : data =>{
          this.snackBar.open('Successfully unassigned member from task!', 'Close', { duration: 3000 });
          this.waiting = false;
          this.fetchMembersOnTask()
        },
        error : error =>{
          this.snackBar.open('Failed unassigning member from task!', 'Close', { duration: 3000 });
          this.waiting = false;
        }
      })
    }
  }
  dataSource : any
  displayedColumns = ['assigned', 'avatar', 'name', 'projectRole', 'email'];

  fetchMembersOnTask()
  {
      this.tService.getTaskById(this.task.taskId).subscribe((data : Task)=>{
      this.taskLeaderId = data.taskLeaderId
      this.membersOnThisTask = data.assignedMembers;
      this.pService.getMembersByProjectId(this.task.projectId).subscribe((members2 : Member[]) =>{
        this.allMembersOnProject = members2;
        this.dataSource = new MatTableDataSource(this.allMembersOnProject);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    })

  }

  isMemberOnTask(memberId : number) : boolean
  {
    for(let i=0;i<this.membersOnThisTask.length;i++)
    {
      if(memberId === this.membersOnThisTask[i].id)
        return true;
    }
    return false;
  }

  editTaskLeader()
  {
    if(this.taskLeaderFormGroup.valid)
    {
      const taskData = this.taskLeaderFormGroup.value
      this.tService.assignNewTaskLeader(this.task.taskId, taskData.newTaskLeaderId ).subscribe({
        next : data =>{ this.updateTaskInfo(); this.snackBar.open('Successfully changed task leader!', 'Close', { duration: 3000 }); this.taskModified.emit(); this.fetchMembersOnTask()},
        error : error => {console.log(error); this.snackBar.open('Failed to change task leader!', 'Close', { duration: 3000 });}
      })
    }
    else
      this.taskLeaderFormGroup.markAllAsTouched();
  }

}


