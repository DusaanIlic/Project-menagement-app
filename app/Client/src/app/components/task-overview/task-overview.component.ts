import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
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

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxEditorModule, NgToastModule],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent{

    members : Member[] = [];
    commentText = "";
  lessThanHour : boolean = false;
  lessThanDay : boolean = false;
  differenceM : number = 0;
  differenceH : number = 0;
  activities : taskActivity[] = [];
    editor: Editor = new Editor;
    html: any;

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>, @Inject(MAT_DIALOG_DATA) public task: Task, private tService : TaskService, private mService : MemberService)
  {
    this.dateCheck();
    this.getTaskActivities();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  dateCheck()
  {
    //this.differenceM = Math.trunc((new Date().getTime() - this.activities[this.task.taskId].dateModified?.getTime()) / (1000 * 60)); //racuna minute
    //this.differenceH = Math.trunc((new Date().getTime() - this.activities[this.task.taskId].dateModified?.getTime()) / (1000 * 3600)); //racuna minute

    if(this.differenceM < 60)
      this.lessThanHour = true;
    else
      this.lessThanHour = false;

    if(this.differenceH < 24)
      this.lessThanDay = true;
    else
        this.lessThanDay = false;
  }

  getTaskActivities()
  {
    this.tService.getTaskActivities().subscribe((taskactivities : taskActivity[]) => {
        this.activities = taskactivities;
        this.getMembersById();
    })
  }

  getMembersById()
  {
    for(let i=0;i<this.activities.length;i++)
        {
            this.mService.getMemberById(this.activities[i].workerId).subscribe((member : Member) =>{
                this.members.push(member);
                console.log(member);
            })
        }
  }
 

}
