import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG, GanttPrintService,
  GanttToolbarOptions,
  GanttViewType,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent
} from "@worktile/gantt";
import {enUS} from "date-fns/locale";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {switchMap} from "rxjs/operators";
import {Task} from "../../models/task";
import {combineLatest, forkJoin, map} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";

@Component({
  selector: 'app-project-gantt',
  standalone: true,
  imports: [
    NgxGanttComponent,
    NgxGanttTableColumnComponent,
    NgxGanttTableComponent,
    DatePipe,
    NgIf,
    MatButton,
    NgForOf,
    MatRadioButton,
    MatRadioGroup,

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
          week: 'LLLL',
          yearWeek: 'LLLL',
          yearMonth: `LLLL yyyy'(week' w ')'`,
          year: 'yyyy',
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

  @ViewChild('gantt') ganttComponent: any;

  views = [
    {
      name: 'Hour',
      value: GanttViewType.hour
    },
    {
      name: 'Day',
      value: GanttViewType.day
    },
    {
      name: 'Week',
      value: GanttViewType.week
    },
    {
      name: 'Month',
      value: GanttViewType.month
    },
    {
      name: 'Quarter',
      value: GanttViewType.quarter
    },
    {
      name: 'Year',
      value: GanttViewType.year
    }
  ];

  viewType: GanttViewType = GanttViewType.day;
  selectedViewType: GanttViewType = GanttViewType.day;

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.pipe(
      switchMap(params => {
        const projectId = params['id'];
        this.projectId = projectId;

        const tasks$ = this.taskService.getTasksByProject(projectId);
        const taskCategories$ = this.taskService.getTaskCategories();

        return combineLatest([tasks$, taskCategories$]).pipe(
          switchMap(([tasks, taskCategories]) => {
            const dependentTasksObservables = tasks.map(task =>
              this.taskService.getDependantTasks(task.taskId)
            );

            return forkJoin(dependentTasksObservables).pipe(
              map(dependentTasksArray => {
                // Map the dependentTasksArray to the tasks
                tasks.forEach((task, index) => {
                  task.dependentTasks = dependentTasksArray[index];
                });
                return { tasks, taskCategories };
              })
            );
          })
        );
      })
    ).subscribe({
      next: ({ tasks, taskCategories }) => {
        this.tasks = tasks;
        this.taskCategories = taskCategories;
        this.mapTasksToGanttItems();
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
      const dependentTaskIds = task.dependentTasks?.map((depTask: { taskId: any; }) => String(depTask.taskId)) || [];

      return {
        id: String(task.taskId),
        title: task.taskName,
        start: new Date(task.startDate).getTime(),
        end: new Date(task.deadline).getTime(),
        group_id: String(task.taskCategoryId),
        progress: this.calculateProgress(task), // Call your progress calculation method
        links: dependentTaskIds
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
    return 100; // Default progress
  }

  selectView(type: GanttViewType) {
    this.viewType = type;
    this.selectedViewType = type;

    this.scrollToToday();
  }

  scrollToToday() {
    this.ganttComponent.scrollToToday();
  }
}
