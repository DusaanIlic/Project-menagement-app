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

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxEditorModule, NgToastModule , NgToastModule],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit{




  project : Project = {
    id: 0,
    projectName: '',
    endDate: new Date(),
    startDate: new Date(),
    description: '',
    details: '',
    status: '',
    lead: ''
  };
    activitiesForThisTask : taskActivity[] = [];
    members : Member[] = [];
    commentText = "";
    activities : taskActivity[] = [];
    editor: Editor = new Editor;
    editor1: Editor = new Editor;
    taskActivityDesc: any;
    description: any;

    selectedType: any;
    allTypes : taskActivityType[] = [];
    
    
    show: any;
    showEditorForDesc: boolean = false;

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>, @Inject(MAT_DIALOG_DATA) public task: Task,
        private tService : TaskService, private mService : MemberService, private _ngToastService: NgToastService) { }

  ngOnInit()
  {
    this.show = 'overview';
    this.description = this.task.taskDescription;
    this.taskActivityDesc = "";
    this.selectedType = "-1"
    this.tService.getTaskActivityType().subscribe((data : any) =>{
      this.allTypes = data;
      //console.log(data);
      this.fetchTaskActivities();
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

    
      switchView(tab : string) {
        if(tab === 'overview')
          this.show = 'overview'
        else if(tab === 'dependacies')
          this.show = 'dependacies';
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

}

