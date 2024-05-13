import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG,
  GanttBarClickEvent,
  GanttDragEvent,
  GanttGroup,
  GanttItem,
  GanttLinkDragEvent,
  GanttSelectedEvent,
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
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddTaskComponent} from "../add-task/add-task.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {taskPriority} from "../../models/taskPriority";
import {MatDivider} from "@angular/material/divider";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {TaskStatus} from "../../models/task-status";

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
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatDivider,
    MatOption,
    MatSelect,

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
          yearMonth: `LLLL yyyy`,
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
  taskPriorities!: taskPriority[];
  taskStatuses!: TaskStatus[];
  ganttGroups: GanttGroup[] = [];
  ganttItems: GanttItem[] = [];
  defaultStatus: number = 0;
  selectedStatus: number = 0;
  defaultPriority: number = 0;
  selectedPriority: number = 0;
  searchedTerm: string = '';
  private originalGanttItems: any = [];
  private routeSubscription: any;

  @ViewChild('gantt') ganttComponent: any;

  views = [
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
        const taskCategories$ = this.taskService.getTaskCategories(projectId);

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

    this.taskService.getTaskPriorities().subscribe({
      next: (data: taskPriority[]) => {
        this.taskPriorities = data;
      },
      error: error => {
        console.log('failed fetching task priorities');
      }
    });

    this.taskService.getTaskStatusesByProject(this.projectId).subscribe({
      next: (data: TaskStatus[]) => {
        this.taskStatuses = data;
      },
      error: err => {
        console.log('failed fetching task statuses');
      }
    })
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  search(event: Event): void {
    this.searchedTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  private mapTasksToGanttItems(): void {
    this.ganttGroups = this.taskCategories.map((category: { taskCategoryID: any; categoryName: any; }) => {
      return {
        id: String(category.taskCategoryID),
        title: category.categoryName,
        expanded: true
      }
    });

    this.originalGanttItems = this.tasks.map((task: Task) => {
      const dependentTaskIds = task.dependentTasks?.map((depTask: { taskId: any; }) => String(depTask.taskId)) || [];
      const links = dependentTaskIds.length ? dependentTaskIds : undefined;

      return {
        id: String(task.taskId),
        group_id: String(task.taskCategoryId),
        title: task.taskName,
        start: new Date(task.startDate).getTime(),
        end: new Date(task.deadline).getTime(),
        links: links,
        color: this.taskPriorities.find(priority => priority.taskPriorityId == task.taskPriorityId)?.color,
        progress: 100, // Call your progress calculation method,
        itemDraggable: true,
        linkable: true,
        taskStatusId:  task.taskStatusId,
        taskPriorityId: task.taskPriorityId
      };
    });

    this.ganttItems = this.originalGanttItems;
  }

  scrollToToday() {
    this.ganttComponent.scrollToToday();
  }

  selectedChange(event: GanttSelectedEvent) {
    event.current && this.ganttComponent.scrollToDate(event.current?.start);
  }

  barClick($event: GanttBarClickEvent) {
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
      const taskId= Number(event.source.id);
      const dTaskId= Number(event.target.id);

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

  onStatusFilterChange(event: any) {
    this.selectedStatus = event;
    this.applyFilters();
  }

  onPriorityFilterChange(event: any) {
    this.selectedPriority = event;
    this.applyFilters();
  }

  applyFilters() {
    this.ganttItems = this.originalGanttItems.filter((task: { title: string, taskStatusId: number; taskPriorityId: number; }) =>
      (this.selectedStatus == this.defaultStatus || this.selectedStatus == task.taskStatusId) &&
      (this.selectedPriority == this.defaultPriority || this.selectedPriority == task.taskPriorityId) &&
      (task.title.toLowerCase().includes(this.searchedTerm))
    );

    if (this.ganttItems.length != 0) {
      this.ganttComponent.scrollToDate(this.ganttItems[0].start);
    }
  }
}
