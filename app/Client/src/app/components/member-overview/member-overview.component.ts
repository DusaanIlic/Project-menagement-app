import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from "../task-overview/task-overview.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { ProjectServiceGet } from '../../services/project.service';
import { Project } from '../../models/project';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { taskPriority } from '../../models/taskPriority';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-member-overview',
    standalone: true,
    templateUrl: './member-overview.component.html',
    styleUrl: './member-overview.component.scss',
    imports: [CommonModule, TaskOverviewComponent, MatDialogModule, MatButtonModule, MatMenuModule]
})
export class MemberOverviewComponent implements OnInit{
  routeSub: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private mService : MemberService, private tService : TaskService, private pService : ProjectServiceGet) {}

  member : Member = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    roleId: 1,
    dateAdded: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    status: '',
    country: '',
    city: '',
    dateOfBirth: new Date()
  };

  p? : Project;
  projects : Project[] = [];
  activities : taskActivity[] = [];
  tasks : Task[] = [];
  mRole : string = "";



  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.member.id = params['id'];
      console.log("Member id:", this.member.id); // log the value of id
  
      this.tService.getTasksByMember(this.member.id).pipe(
        switchMap((tasks: Task[]) => {
          this.tasks = tasks;
          return this.getTaskPriorities();
        })
      ).subscribe();
    });
  }
  
  getTaskPriorities() {
    const observables = [];
    for (let i = 0; i < this.tasks.length; i++) {
      observables.push(this.tService.getTaskPriority(this.tasks[i].taskId));
    }
    return forkJoin(observables);
  }



  //////////////////////////////////////////////////////
  
  

  openDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
