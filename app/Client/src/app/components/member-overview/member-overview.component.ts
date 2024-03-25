import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-overview.component.html',
  styleUrl: './member-overview.component.scss'
})
export class MemberOverviewComponent implements OnInit{
  
  member : Member = {
    id: 1,
    fullName: 'Pera Peric',
    email: 'pera.peric@gmail.com',
    role: 'Project Manager',
    dateAdded: '1/1/2024'
  };

  activity : taskActivity = {
    projectName : "Project 123",
    taskName : "Task 1",
    memberName : "Pera Peric",
    type : "Update",
    dateModified : Date.now(),
    description : "I made gantt view without colours."
  }
  activities : taskActivity[] = [];



  ngOnInit(): void {
    this.activities.push(this.activity);
    this.activities.push(this.activity);
    this.activities.push(this.activity);
    this.activities.push(this.activity);
    this.activities.push(this.activity);
  }

}
