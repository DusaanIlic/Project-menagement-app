import { ChangeDetectorRef, Component } from '@angular/core';
import {CommonModule, NgIf, NgOptimizedImage} from "@angular/common";
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { catchError, map } from 'rxjs/operators';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { TaskOverviewComponent } from '../task-overview/task-overview.component';
import {ProjectServiceGet} from "../../services/project.service";
import {taskCategory} from "../../models/taskCategory";
import {environment} from "../../../environments/environment";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";


@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    MatDialogModule,
    NgToastModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  projectId: number = 0;
  allTasks: Task[] = []
  taskCategories : taskCategory[] = [];
  visible : boolean[] = []
  tableSel: string = 't1';

  constructor(public dialog: MatDialog,
              private taskService: TaskService,
              private _ngToastService: NgToastService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private tService : TaskService,
              private pService : ProjectServiceGet){}

  ngOnInit(): void{
    this.getProjectIdFromRoute();
    this.loadTasksByProject(this.projectId);
    for(let i=0;i<this.taskCategories.length;i++)
      this.visible.push(false)
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });

    dialogRef.componentInstance.taskAdded.subscribe(() => {
      this.loadTasksByProject(this.projectId); // Ponovo učitava zadatke nakon dodavanja novog zadatka
    });
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
          console.log(data)
          this.allTasks = data
          this.todo = data.filter(task => task.taskStatusId === 1).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.progress = data.filter(task => task.taskStatusId === 2).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.done = data.filter(task => task.taskStatusId === 3).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.getAllTaskCategoriesOnProject()
        return data;
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          throw error;
        })
      )
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  getProjectIdFromRoute(){
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }

  openDialogOverview(taskId : number)
  {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: taskId
    });
  }

  deleteTask(taskId : number)
  {
    this.tService.deleteTask(taskId).subscribe({
      next : data =>{
        this.loadTasksByProject(this.projectId);
      },
      error : error =>{
        console.log("Error deleting task!")
      }
    });
  }

  hasElement(elem : taskCategory): boolean
  {
    for(let i=0;i<this.taskCategories.length;i++)
    {
      if(this.taskCategories[i].taskCategoryId == elem.taskCategoryId && this.taskCategories[i].taskCategoryName == elem.taskCategoryName)
        return true;
    }
    return false;
  }

  getAllTaskCategoriesOnProject()
  {
    this.pService.getTaskCategoriesOnProject(this.projectId).subscribe((data : taskCategory[]) =>{
     for(let i=0;i<data.length;i++)
     {
       if(!this.hasElement(data[i]))
         this.taskCategories.push(data[i])
     }

    })
  }


  showNHide(i: number)
  {
    this.visible[i] = !this.visible[i];
  }


}
