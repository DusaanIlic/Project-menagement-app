import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG,
  GanttItem,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent
} from "@worktile/gantt";
import {enUS, fr} from "date-fns/locale";
import {DatePipe, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {switchMap} from "rxjs/operators";
import {Task} from "../../models/task";
import {combineLatest} from "rxjs";
import {data} from "autoprefixer";

@Component({
  selector: 'app-project-gantt',
  standalone: true,
  imports: [
    NgxGanttComponent,
    NgxGanttTableColumnComponent,
    NgxGanttTableComponent,
    DatePipe,
    NgIf,

  ],
  templateUrl: './project-gantt.component.html',
  styleUrl: './project-gantt.component.scss',
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: {
          yearQuarter: `QQQ 'of' yyyy`,
          month: 'LLLL',
          yearMonth: `LLLL yyyy'(week' w ')'`,
          locale: enUS
        },
      }
    }
  ]
})
export class ProjectGanttComponent  implements OnInit, OnDestroy {
  projectId: any;
  tasks: any;
  taskCategories: any;
  ganttTasks: any;
  ganttCategories: any;
  startRendering: boolean = false;
  private routeSubscription: any;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        this.projectId = projectId;

        const tasks$ = this.taskService.getTasksByProject(projectId);
        const taskCategories$ = this.taskService.getTaskCategories();

        return combineLatest([tasks$, taskCategories$]);
      })
    ).subscribe({
      next: ([tasks, taskCategories]) => {
        this.tasks = tasks;
        this.taskCategories = taskCategories;
        this.mapTasksToGanttItems();
        console.log(this.ganttCategories);
        console.log(this.ganttTasks);
      },
      error: error => {
        console.log(`Failed fetching tasks for project with id ${this.projectId}`);
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  private mapTasksToGanttItems(): void {
    this.ganttTasks = this.tasks.map((task: Task) => {
      return {
        id: String(task.taskId),
        title: task.taskName,
        start: new Date(task.startDate).getTime(),
        end: new Date(task.deadline).getTime(),
        group_id: String(task.taskCategoryId),
        progress: 100, // Assuming you have a method to calculate progress,
        draggable: true
      };
    });

    this.ganttCategories = this.taskCategories.map((taskCategory: any) => {
      return {
        id: String(taskCategory.taskCategoryID),
        title: taskCategory.categoryName,
        expanded: true
      }
    });

    this.startRendering = true;
  }

  private calculateProgress(task: Task): number {
    // Implement your logic to calculate progress, for example:
    // return (completedTasks / totalTasks) * 100;
    return 0; // Default progress
  }
}
