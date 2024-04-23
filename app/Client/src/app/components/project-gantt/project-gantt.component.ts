import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG,
  GanttBarClickEvent,
  GanttDragEvent,
  GanttItem,
  GanttLinkDragEvent,
  GanttPrintService,
  GanttSelectedEvent, GanttTableDragEnterPredicateContext,
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
import {MatDialog} from "@angular/material/dialog";
import {TaskOverviewComponent} from "../task-overview/task-overview.component";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddTaskComponent} from "../add-task/add-task.component";

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
    FormsModule,

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

  constructor(private route: ActivatedRoute, private taskService: TaskService,
              private matDialog: MatDialog, private snackBar: MatSnackBar) { }

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
    this.ganttTasks = this.taskCategories
      .filter((taskCategory: { taskCategoryID: number; }) => taskCategory.taskCategoryID !== 1)
      .map((taskCategory: any) => {
      const tasks = this.tasks.filter((task: { taskCategoryId: any; }) => task.taskCategoryId == taskCategory.taskCategoryID);

      const children = tasks.map((task: Task) => {
        const dependentTaskIds = task.dependentTasks?.map((depTask: { taskId: any; }) => String(depTask.taskId)) || [];
        const links = dependentTaskIds.length ? dependentTaskIds : undefined;

        return {
          id: String(task.taskId),
          title: task.taskName,
          start: new Date(task.startDate).getTime(),
          end: new Date(task.deadline).getTime(),
          links: links,
          progress: 100, // Call your progress calculation method,
          itemDraggable: true,
          linkable: true
        };
      });

      const currTime = new Date().getTime();

      return {
        id: `C${taskCategory.taskCategoryID}`,
        title: taskCategory.taskCategoryID == 1 ? '' : taskCategory.categoryName,
        start: currTime + 100000000,
        end: currTime - 1000000000,
        children: children,
        expanded: true,
        linkable: false,
        itemDraggable: true,
        draggable: false
      };
    });

    // Taskovi koji nemaju kategoriju
    const tasks = this.tasks
      .filter((task: Task) => task.taskCategoryId == 1)
      .map((task: Task) => {
      const dependentTaskIds = task.dependentTasks?.map((depTask: { taskId: any; }) => String(depTask.taskId)) || [];
      const links = dependentTaskIds.length ? dependentTaskIds : undefined;

      return {
        id: String(task.taskId),
        title: task.taskName,
        start: new Date(task.startDate).getTime(),
        end: new Date(task.deadline).getTime(),
        links: links,
        progress: 100, // Call your progress calculation method,
        itemDraggable: true,
        linkable: true
      };
    });

    this.ganttTasks = [...this.ganttTasks, ...tasks];

    console.log(this.ganttTasks);

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

  selectedChange(event: GanttSelectedEvent) {
    if (event.current && event.current.id.includes('C')) {
      return;
    }

    event.current && this.ganttComponent.scrollToDate(event.current?.start);
  }

  barClick($event: GanttBarClickEvent) {
    if ($event.item.id.includes('C')) {
      return;
    }

    this.openTaskOverview(Number($event.item.id));
  }

  openTaskOverview(taskId: number): void {
    const dialogRef = this.matDialog.open(TaskOverviewComponent, {
      width: '250px',
      data: taskId
    });
  }

  openAddTask() {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });
  }

  dragEnded(event: GanttDragEvent) {
    if (event.item.id && event.item.start && event.item.end) {
      const taskId = Number(event.item.id);
      const startTimestamp = event.item.start * 1000;
      const endTimestamp = event.item.end * 1000;

      // Create UTC dates
      const utcStartDate = new Date(startTimestamp);
      const utcEndDate = new Date(endTimestamp);

      // Set the timezone offset to 0 to get the UTC time
      utcStartDate.setMinutes(utcStartDate.getMinutes() - utcStartDate.getTimezoneOffset());
      utcEndDate.setMinutes(utcEndDate.getMinutes() - utcEndDate.getTimezoneOffset());

      console.log(`UTC Start Date: ${utcStartDate.toISOString()}, UTC End Date: ${utcEndDate.toISOString()}`);

      this.taskService.changeTaskDates(taskId, utcStartDate, utcEndDate).subscribe({
        next: data => {
          this.snackBar.open('Successfully changed task date!', 'Close', { duration: 1500 });
        },
        error: error => {
          this.snackBar.open('Failed changing task date!', 'Close', { duration: 1500 });
        }
      });
    }
  }

  linkEnded(event: GanttLinkDragEvent) {
    if (event.source && event.target) {
      const taskId = Number(event.source.id);
      const dTaskId = Number(event.target.id);

      this.taskService.addTaskDependency(taskId, dTaskId).subscribe({
        next: data => {
          this.snackBar.open('Successfully added dependency!', 'Close', { duration: 1500 });
        },
        error: error => {
          this.snackBar.open('Failed adding dependency', 'Close', { duration: 1500 });
        }
      });
    }
  }

  dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
    return event.dropPosition !== 'inside';
  };
}
