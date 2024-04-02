import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { taskActivity } from '../../models/taskActivity';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent{

    taskAct? : taskActivity;
    commentText = "";
  lessThanHour : boolean = false;
  lessThanDay : boolean = false;
  differenceM : number = 0;
  differenceH : number = 0;
  activities : taskActivity[] = [
    {
      "projectId": 1,
      "taskId": 1,
      "memberId": 1,
      "projectName": "Project Delta",
      "taskName": "Backend Development",
      "memberName": "Elena Rodriguez",
      "type": "Update",
      "dateModified": new Date("April 02, 2024 10:00:00"),
      "description": "Implemented authentication system."
  },
  {
      "projectId": 1,
      "taskId": 2,
      "memberId": 2,
      "projectName": "Project Delta",
      "taskName": "Backend Development",
      "memberName": "Veljko Djurovic",
      "type": "Bug fix",
      "dateModified": new Date("April 01, 2024 23:00:00"),
      "description": "Test1."
  },
  {
      "projectId": 1,
      "taskId": 3,
      "memberId": 3,
      "projectName": "Project Delta",
      "taskName": "Frontend Development",
      "memberName": "David Lee",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Integrated API endpoints."
  },
  {
      "projectId": 2,
      "taskId": 4,
      "memberId": 4,
      "projectName": "Project Epsilon",
      "taskName": "Testing Phase",
      "memberName": "Maria Garcia",
      "type": "Bug Fix",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Fixed UI rendering issue."
  },
  {
      "projectId": 2,
      "taskId": 5,
      "memberId": 5,
      "projectName": "Project Epsilon",
      "taskName": "Deployment",
      "memberName": "Chris Johnson",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Deployed latest version to production."
  },
  {
      "projectId": 3,
      "taskId": 6,
      "memberId": 6,
      "projectName": "Project Zeta",
      "taskName": "Documentation",
      "memberName": "Sophia Kim",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Updated project documentation."
  },
  {
      "projectId": 3,
      "taskId": 7,
      "memberId": 7,
      "projectName": "Project Zeta",
      "taskName": "Code Review",
      "memberName": "Emma Wilson",
      "type": "Review",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Reviewed pull requests."
  },
  {
      "projectId": 4,
      "taskId": 8,
      "memberId": 8,
      "projectName": "Project Theta",
      "taskName": "Feature Development",
      "memberName": "Michael Brown",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Implemented new feature."
  },
  {
      "projectId": 4,
      "taskId": 9,
      "memberId": 9,
      "projectName": "Project Theta",
      "taskName": "Testing",
      "memberName": "Laura Martinez",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Performed regression testing."
  },
  {
      "projectId": 5,
      "taskId": 10,
      "memberId": 10,
      "projectName": "Project Iota",
      "taskName": "Database Optimization",
      "memberName": "William Jones",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Optimized database queries."
  },
  {
      "projectId": 5,
      "taskId": 11,
      "memberId": 11,
      "projectName": "Project Iota",
      "taskName": "Security Audit",
      "memberName": "Olivia White",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Conducted security vulnerability assessment."
  },
  {
      "projectId": 6,
      "taskId": 12,
      "memberId": 12,
      "projectName": "Project Kappa",
      "taskName": "Integration",
      "memberName": "Daniel Davis",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Integrated third-party services."
  },
  {
      "projectId": 6,
      "taskId": 13,
      "memberId": 13,
      "projectName": "Project Kappa",
      "taskName": "Bug Fixing",
      "memberName": "Sophie Brown",
      "type": "Bug Fix",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Resolved critical bugs."
  },
  {
      "projectId": 7,
      "taskId": 14,
      "memberId": 14,
      "projectName": "Project Lambda",
      "taskName": "UI Design",
      "memberName": "Jackson Taylor",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Designed user interface components."
  },
  {
      "projectId": 7,
      "taskId": 15,
      "memberId": 15,
      "projectName": "Project Lambda",
      "taskName": "Performance Optimization",
      "memberName": "Amelia Clark",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Optimized application performance."
  },
  {
      "projectId": 8,
      "taskId": 16,
      "memberId": 16,
      "projectName": "Project Mu",
      "taskName": "Feature Implementation",
      "memberName": "Liam Brown",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Implemented new feature."
  },
  {
      "projectId": 8,
      "taskId": 17,
      "memberId": 17,
      "projectName": "Project Mu",
      "taskName": "Testing Phase",
      "memberName": "Charlotte Evans",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Tested new functionalities."
  },
  {
      "projectId": 9,
      "taskId": 18,
      "memberId": 18,
      "projectName": "Project Nu",
      "taskName": "Documentation",
      "memberName": "James Smith",
      "type": "Update",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Updated project documentation."
  },
  {
      "projectId": 9,
      "taskId": 19,
      "memberId": 19,
      "projectName": "Project Nu",
      "taskName": "Code Review",
      "memberName": "Ava Johnson",
      "type": "Review",
      "dateModified": new Date("1. 2. 2024."),
      "description": "Reviewed pull requests."
  }
  ];

  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>, @Inject(MAT_DIALOG_DATA) public taskId: number)
  {
    this.dateCheck();
    console.log(taskId);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  dateCheck()
  {
    this.differenceM = Math.trunc((new Date().getTime() - this.activities[this.taskId].dateModified?.getTime()) / (1000 * 60)); //racuna minute
    this.differenceH = Math.trunc((new Date().getTime() - this.activities[this.taskId].dateModified?.getTime()) / (1000 * 3600)); //racuna minute

    if(this.differenceM < 60)
      this.lessThanHour = true;
    else
      this.lessThanHour = false;

    if(this.differenceH < 24)
      this.lessThanDay = true;
    else
        this.lessThanDay = false;
  }

  saveComment()
  {
    this.taskAct = 
    {
        projectId : this.activities[this.taskId].projectId,
        taskId: this.activities[this.taskId].taskId,
        memberId: this.activities[this.taskId].memberId,
        projectName : this.activities[this.taskId].projectName,
        taskName : this.activities[this.taskId].taskName,
        memberName : this.activities[this.taskId].memberName,
        type : this.activities[this.taskId].type,
        dateModified : new Date(),
        description : this.commentText,
    }
        console.log(this.taskAct);
    }
 

}
