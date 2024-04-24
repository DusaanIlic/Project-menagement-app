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
import {forkJoin, Observable} from 'rxjs';
import {environment} from "../../../environments/environment";


@Component({
    selector: 'app-member-overview',
    standalone: true,
    templateUrl: './member-overview.component.html',
    styleUrl: './member-overview.component.scss',
    imports: [CommonModule, TaskOverviewComponent, MatDialogModule, MatButtonModule, MatMenuModule]
})
export class MemberOverviewComponent implements OnInit{
  routeSub: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute,
                private mService : MemberService, private tService : TaskService,
                  private pService : ProjectServiceGet) {}

  member : Member = {
    checked: undefined, isDisabled: false,
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    roleId: 1,
    roleName: '',
    dateAdded: new Date(1, 2, 3),
    country: '',
    city: '',
    github: '',
    dateOfBirth: new Date(1, 2, 3),
    linkedin: '',
    status: '',
    phoneNumber: '',
    numberOfTasks: 0
  };

  p? : Project;
  projects : Project[] = [];
  tasks : Task[] = [];

  ngOnInit()
  {
    this.routeSub = this.route.params.pipe(
      switchMap(params => {
        this.member.id = params['id'];

        this.mService.getMemberById(this.member.id).subscribe(
          (member =>{
            this.member = member;
          })
        )

        return this.tService.getTasksByMember(this.member.id).pipe(
          switchMap(tasks => {
            this.tasks = tasks;

            const observables = [];

            for (let i = 0; i < tasks.length; i++) {
              const projectObservable = this.pService.getProjectById(tasks[i].projectId);
              const taskPriorityObservable = this.tService.getTaskPriority(tasks[i].taskPriorityId);

              observables.push(projectObservable);
              observables.push(taskPriorityObservable);
            }

            return forkJoin(observables).pipe(
              switchMap((results : any) => {
                // Use results to update tasks
                for (let i = 0; i < tasks.length; i++) {
                  const projectIndex = i * 2;
                  tasks[i].projectName = results[projectIndex].projectName;

                  const taskPriorityIndex = projectIndex + 1;
                  tasks[i].taskPriorityName = results[taskPriorityIndex].name;
                }

                return tasks;
              })
            );
          })
        );
      })
    ).subscribe({
      next: tasks => {
        console.log(tasks);
      },
      error: error => {
        console.error(error)
      }
    });
  }



  //////////////////////////////////////////////////////



  openDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: task.taskId
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

    protected readonly environment = environment;
}
