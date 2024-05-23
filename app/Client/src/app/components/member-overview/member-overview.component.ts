import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from '../task-overview/task-overview.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MemberService } from '../../services/member.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { ProjectServiceGet } from '../../services/project.service';
import { Project } from '../../models/project';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { taskPriority } from '../../models/taskPriority';
import { switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  templateUrl: './member-overview.component.html',
  styleUrl: './member-overview.component.scss',
  imports: [
    CommonModule,
    TaskOverviewComponent,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatPaginator,
    MatDivider,
    MatTableModule,
  ],
})
export class MemberOverviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  routeSub: any;
  tasks: Task[] = []; // Vaši zadaci
  startIndex = 0;

  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns: string[] = [
    'project',
    'task',
    'dueDate',
    'status',
    'priority',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private mService: MemberService,
    private tService: TaskService,
    private pService: ProjectServiceGet
  ) {}

  member: Member = {
    checked: undefined,
    isDisabled: false,
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
    numberOfTasks: 0,
  };

  p?: Project;
  projects: Project[] = [];

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.member.id = params['id'];
          return this.mService.getMemberById(this.member.id);
        }),
        switchMap((member) => {
          this.member = member;
          return this.tService.getTasksByMember(this.member.id);
        }),
        switchMap((tasks) => {
          this.tasks = tasks;
          const observables = this.tasks.map((task) => {
            const projectObservable = this.pService.getProjectById(
              task.projectId
            );
            const taskPriorityObservable = this.tService.getTaskPriority(
              task.taskPriorityId
            );
            return forkJoin([projectObservable, taskPriorityObservable]);
          });
          return forkJoin(observables);
        })
      )
      .subscribe((results) => {
        results.forEach((result, index) => {
          this.tasks[index].projectName = result[0].projectName;
          this.tasks[index].taskPriorityName = result[1].name;
        });
        this.dataSource.data = this.tasks;
        this.dataSource.paginator = this.paginator;
      });
  }

  //////////////////////////////////////////////////////
  openDialogOverview(taskId: number) {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: taskId,
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    //this.dataSource.data = this.tasks.slice(startIndex, endIndex);
    this.dataSource.paginator = this.paginator;
  }

  openDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: task.taskId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  protected readonly environment = environment;
}
