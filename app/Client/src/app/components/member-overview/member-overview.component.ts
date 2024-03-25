import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project';


@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-overview.component.html',
  styleUrl: './member-overview.component.scss'
})
export class MemberOverviewComponent{
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
          "projectName": "Project Delta",
          "taskName": "Backend Development",
          "memberName": "Elena Rodriguez",
          "type": "Update",
          "dateModified": 20240324,
          "description": "Implemented authentication system."
      },
      {
          "projectName": "Project Delta",
          "taskName": "Frontend Development",
          "memberName": "David Lee",
          "type": "Update",
          "dateModified": 20240322,
          "description": "Integrated API endpoints."
      },
      {
          "projectName": "Project Epsilon",
          "taskName": "Testing Phase",
          "memberName": "Maria Garcia",
          "type": "Bug Fix",
          "dateModified": 20240320,
          "description": "Fixed UI rendering issue."
      },
      {
          "projectName": "Project Epsilon",
          "taskName": "Deployment",
          "memberName": "Chris Johnson",
          "type": "Update",
          "dateModified": 20240318,
          "description": "Deployed latest version to production."
      },
      {
          "projectName": "Project Zeta",
          "taskName": "Documentation",
          "memberName": "Sophia Kim",
          "type": "Update",
          "dateModified": 20240316,
          "description": "Updated project documentation."
      },
      {
          "projectName": "Project Zeta",
          "taskName": "Code Review",
          "memberName": "Emma Wilson",
          "type": "Review",
          "dateModified": 20240314,
          "description": "Reviewed pull requests."
      },
      {
          "projectName": "Project Theta",
          "taskName": "Feature Development",
          "memberName": "Michael Brown",
          "type": "Update",
          "dateModified": 20240312,
          "description": "Implemented new feature."
      },
      {
          "projectName": "Project Theta",
          "taskName": "Testing",
          "memberName": "Laura Martinez",
          "type": "Update",
          "dateModified": 20240310,
          "description": "Performed regression testing."
      },
      {
          "projectName": "Project Iota",
          "taskName": "Database Optimization",
          "memberName": "William Jones",
          "type": "Update",
          "dateModified": 20240308,
          "description": "Optimized database queries."
      },
      {
          "projectName": "Project Iota",
          "taskName": "Security Audit",
          "memberName": "Olivia White",
          "type": "Update",
          "dateModified": 20240306,
          "description": "Conducted security vulnerability assessment."
      },
      {
          "projectName": "Project Kappa",
          "taskName": "Integration",
          "memberName": "Daniel Davis",
          "type": "Update",
          "dateModified": 20240304,
          "description": "Integrated third-party services."
      },
      {
          "projectName": "Project Kappa",
          "taskName": "Bug Fixing",
          "memberName": "Sophie Brown",
          "type": "Bug Fix",
          "dateModified": 20240302,
          "description": "Resolved critical bugs."
      },
      {
          "projectName": "Project Lambda",
          "taskName": "UI Design",
          "memberName": "Jackson Taylor",
          "type": "Update",
          "dateModified": 20240228,
          "description": "Designed user interface components."
      },
      {
          "projectName": "Project Lambda",
          "taskName": "Performance Optimization",
          "memberName": "Amelia Clark",
          "type": "Update",
          "dateModified": 20240226,
          "description": "Optimized application performance."
      },
      {
          "projectName": "Project Mu",
          "taskName": "Feature Implementation",
          "memberName": "Liam Brown",
          "type": "Update",
          "dateModified": 20240224,
          "description": "Implemented new feature."
      },
      {
          "projectName": "Project Mu",
          "taskName": "Testing Phase",
          "memberName": "Charlotte Evans",
          "type": "Update",
          "dateModified": 20240222,
          "description": "Tested new functionalities."
      },
      {
          "projectName": "Project Nu",
          "taskName": "Documentation",
          "memberName": "James Smith",
          "type": "Update",
          "dateModified": 20240220,
          "description": "Updated project documentation."
      },
      {
          "projectName": "Project Nu",
          "taskName": "Code Review",
          "memberName": "Ava Johnson",
          "type": "Review",
          "dateModified": 20240218,
          "description": "Reviewed pull requests."
      },
      {
          "projectName": "Project Xi",
          "taskName": "Feature Development",
          "memberName": "Ethan Rodriguez",
          "type": "Update",
          "dateModified": 20240216,
          "description": "Implemented new feature."
      },
      {
          "projectName": "Project Xi",
          "taskName": "Testing",
          "memberName": "Chloe Martinez",
          "type": "Update",
          "dateModified": 20240214,
          "description": "Performed regression testing."
      }
  ]
  }

  constructor() {
    this.generateData();

    for(let i=0;i<this.activities.length;i++)
    {
      if(!this.projects.includes(this.activities[i].projectName))
      this.projects.push(this.activities[i].projectName);
    }

    for(let i=0;i<this.projects.length;i++)
    {
      this.expanded.push(false);
    }
  }

}
