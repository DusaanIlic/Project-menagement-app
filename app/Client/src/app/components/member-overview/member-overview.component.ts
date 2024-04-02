import { Component, OnInit, inject} from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from "../task-overview/task-overview.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-member-overview',
    standalone: true,
    templateUrl: './member-overview.component.html',
    styleUrl: './member-overview.component.scss',
    imports: [CommonModule, TaskOverviewComponent, MatDialogModule]
})
export class MemberOverviewComponent implements OnInit{


  httpClient = inject(HttpClient);
  data : any = [];

  private routeSub: Subscription = new Subscription();

hideNshow(i: number) {
  this.expanded[i] = !this.expanded[i];
}
  
  member : Member = {
    id: 1,
    fullName: 'Pera Peric',
    email: 'pera.peric@gmail.com',
    role: 'Project Manager',
    dateAdded: '1/1/2024'
  };

  projects : string[] = [];
  activities : taskActivity[] = [];
  expanded : boolean[] = [];

  generateData()
  {
    this.activities = [
      {
          "projectId": 1,
          "taskId": 1,
          "memberId": 1,
          "projectName": "Project Delta",
          "taskName": "Backend Development",
          "memberName": "Elena Rodriguez",
          "type": "Update",
          "dateModified": new Date("April 01, 2024 10:00:00"),
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
  
  }

  getProjects()
  {
    this.httpClient.get("http://localhost:8000/api/Member/3")
    .subscribe((data) => {
      this.data = data;
    });
  }

  ngOnInit() {
    this.getProjects();
    this.routeSub = this.route.params.subscribe(params => {

    });
  }

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.generateData();

    for(let i=0;i<this.activities.length;i++)
    {
      if(!this.projects.includes(this.activities[i].projectName.trim()))
      this.projects.push(this.activities[i].projectName);
    }

    for(let i=0;i<this.projects.length;i++)
    {
      this.expanded.push(false);
    }
  }

  openDialog(id: number): void {
    console.log(this.activities[id]);
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
