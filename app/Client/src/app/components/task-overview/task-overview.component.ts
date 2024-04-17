import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { taskActivity } from '../../models/taskActivity';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { TaskService } from '../../services/task.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member';
import { Project } from '../../models/project';
import { taskActivityType } from '../../models/taskActivityType';
import { DomSanitizer } from '@angular/platform-browser';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {EditMemberComponent} from "../edit-member/edit-member.component";
import {ProjectService} from "../../services/add.project.service";
import {ProjectServiceGet} from "../../services/project.service";
import {environment} from "../../../environments/environment";
import { MemberInfoComponent } from '../member-info/member-info.component';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxEditorModule, NgToastModule, NgToastModule, MatButton, MatMenu, MatMenuItem],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit{

  lead: Member = {
    id: 0,
      roleId: 0,
      firstName: '',
      lastName: '',
      email: '',
      roleName: '',
      linkedin: '',
      github: '',
      status: '',
      phoneNumber: '',
      country: '',
      city: '',
      dateOfBirth: new Date(),
      dateAdded: new Date()
  }

  project : Project = {
    id: 0,
    projectName: '',
    endDate: new Date(),
    startDate: new Date(),
    description: '',
    details: '',
    status: '',
    lead: this.lead
  };

  
    activitiesForThisTask : taskActivity[] = [];
    membersOnThisProject : Member[] = [];
    commentText = "";
    activities : taskActivity[] = [];
    editor: Editor = new Editor;
    editor1: Editor = new Editor;
    taskActivityDesc: any;
    description: any;
    descriptionForP : any;
    task : Task = {
      assignedMembers: [],
      deadline: new Date(),
      isTaskDependentOn: false,
      projectId: 0,
      projectName: "",
      startDate: new Date(),
      taskCategoryId: 0,
      taskDescription: "",
      taskId: 0,
      taskName: "",
      taskPriorityName: "",
      taskPriorityId: 0,
      taskStatus: "",
      taskStatusId: 0
    };

    depTasks : Task[] = [];

    selectedType: any;
    allTypes : taskActivityType[] = [];


    show: any;
    showEditorForDesc: boolean = false;

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>,
              @Inject(MAT_DIALOG_DATA) public taskId: number,
              private tService : TaskService,
              private mService : MemberService,
              private _ngToastService: NgToastService,
              private sanitizer: DomSanitizer,
              private pService: ProjectServiceGet) { }

  ngOnInit()
  {
    this.tService.getTaskById(this.taskId).subscribe((data : any) => {
      this.task = data;
      this.pService.getProjectById(this.task.projectId).subscribe((project : Project) =>{
        this.project = project;
      })
      this.tService.getTasksDependentOnTaskId(this.task.taskId).subscribe((depTasks : Task[]) =>{
        this.depTasks = depTasks;
        console.log(depTasks);
      })
      this.fetchMembersOnProject();
      //console.log(this.task)
      this.show = 'overview';
      this.description = this.task.taskDescription;
      this.descriptionForP = this.sanitizer.bypassSecurityTrustHtml(this.task.taskDescription) as string
      this.taskActivityDesc = "";
      this.selectedType = "-1"
      this.tService.getTaskActivityType().subscribe((data : any) =>{
        this.allTypes = data;
        //console.log(data);
        this.fetchTaskActivities();
      })
    })
  }

  fetchMembersOnProject()
  {
    this.pService.getMembersByProjectId(this.task.projectId).subscribe((data : Member[]) =>{
      this.membersOnThisProject = data;
      console.log(data)
    })
  }


  fetchTaskActivities()
  {
    this.tService.getTaskActivities().subscribe((taskactivities : taskActivity[]) =>
      {
        this.activities = taskactivities;
        this.activitiesForThisTask = [];

        //this.dateCheck();
        for(let i=0;i<this.activities.length;i++)
          {
            if(this.activities[i].taskId == this.task.taskId)
            {
              this.activities[i].differenceH = Math.trunc((new Date().getTime() - new Date(this.activities[i].dateModify).getTime()) / (1000 * 3600));
              this.activities[i].differenceM = Math.trunc((new Date().getTime() - new Date(this.activities[i].dateModify).getTime()) / (1000 * 60));

            //console.log(this.activities[i].differenceH)
            //console.log(this.activities[i].differenceM)

              this.mService.getMemberById(this.activities[i].workerId).subscribe((member : Member) =>{
                  this.activities[i].memberName = member.firstName + " " + member.lastName;
              })

              this.tService.getTaskActivityName(this.activities[i].taskActivityTypeId).subscribe((data : any) =>{
                this.activities[i].taskActivityName = data.taskActivityTypeName;
              })
              this.activities[i].comment = this.sanitizer.bypassSecurityTrustHtml(this.activities[i].comment) as string;

              this.activitiesForThisTask.push(this.activities[i])
            }

          }
      })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveActivity() {
    const taskAct ={
        taskId : this.task.taskId,
        description : this.taskActivityDesc,
        taskActivityTypeId : this.selectedType,
    }
      if(taskAct.description.trim() == "")
        alert("Activity cannot be empty!")
      else if(taskAct.taskActivityTypeId == -1)
        alert("Please select activity type.")
      else
      {
        this.tService.saveTaskActivity(taskAct).subscribe(
          {
          next : data => {},
          error : error => {
            if(error.statusText == "OK")
              {
                this.showMessage();
                this.fetchTaskActivities();
              }
            else
            {
              this.showMessageError();
            }

          }
        })

      }

      }


      switchView(tab : string)
      {
        this.show = tab;
      }

        showEditor() {
          this.showEditorForDesc = true;
          }


          editDescription() {
            const editTask = {
              taskName: this.task.taskName,
              taskDescription: this.description,
              deadline: this.task.deadline
            }

            if(editTask.taskDescription.trim() == "")
              alert("Description cannot be empty!");
            else
            {
              this.tService.changeTaskDescription(editTask, this.task.taskId).subscribe(
                {
                  next : data =>
                    {
                      console.log(data);
                      window.location.reload()
                    },
                  error : error =>
                    {
                      console.log(error);
                    }
                }
              );
            }



            }



  showMessage()
  {
    this._ngToastService.success({detail: "Success Message", summary: "Task activity add/delete successfully!", duration: 3000});
  }

  showMessageError()
  {
    this._ngToastService.error({detail: "Error Message", summary: "Task activity add/delete failed!", duration: 3000});
  }


  deleteTaskActivity(taskAct: taskActivity) {
    this.tService.deleteTaskActivity(taskAct.taskActivityId).subscribe(
      {
        next : data =>
          {
            this.fetchTaskActivities()
            this.showMessage();
          },
        error : error =>
          {
            this.showMessageError();
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
      this.tService.assignMembersToTask(this.taskId, membersList).subscribe({
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
      this.tService.removeMemberFromTask(this.taskId, memberId ).subscribe({
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
}

