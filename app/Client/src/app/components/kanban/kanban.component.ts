import { Component, EventEmitter, NgModule, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AddTaskStatusComponent } from '../add-task-status/add-task-status.component';
import { ProjectServiceGet } from '../../services/project.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor, FormsModule, CommonModule, NgToastModule, MatDialogModule, AddTaskComponent, AddTaskStatusComponent],
  templateUrl: './kanban.component.html', 
  styleUrl: './kanban.component.scss',
  providers: [DatePipe]
})

export class KanbanComponent implements OnInit {
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];
  dropList: any[] = ['todo', 'progress', 'done'];

  showToDoList: boolean = true;
  showProgressList: boolean = true;
  showDoneList: boolean = true;
  showNewStatusList: boolean = false;

  projectId: number = 0;
  projectName: string = "";
  projectDate: Date | undefined;
  statusName: string = "";
  
  @Output() taskStatusAdded: EventEmitter<any> = new EventEmitter<any>();
  teamLeaderInfo: any;
  
  constructor(private taskService: TaskService, private projectService: ProjectServiceGet, private cdr: ChangeDetectorRef,  private _ngToastService: NgToastService, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.loadTasksByProject(1);
    this.getProjectIdFromRoute();
    this.getProjectByIdFromRoute();
    this.getTeamLeaderInfo(1);
  }

  toggleToDoList(){
    this.showToDoList = !this.showToDoList;
  }
  
  toggleProgressList(){
    this.showProgressList = !this.showProgressList;
  }
  
  toggleDoneList(){
    this.showDoneList = !this.showDoneList;
  }

  columnVisibility: { [key: string]: boolean } = {
    'todo': true,
    'progress': true,
    'done': true
  };

  toggleColumnVisibility(column: string) {
    if(column == 'todo'){
      this.toggleToDoList();
    }
    else if(column == 'progress'){
      this.toggleProgressList();
    }
    else if(column == 'done'){
      this.toggleDoneList();
    }
}

getTeamLeaderInfo(projectId: number): void {
  this.projectService.getProjectById(projectId)
    .subscribe((projectData: any) => {
      const teamLeader = projectData.teamLider;
      if (teamLeader) {
        console.log('Informacije o tim lideru:', teamLeader);
        this.teamLeaderInfo = teamLeader; 
      } else {
        console.error('Nije pronađen tim lider za dati projekat.');
      }
    }, error => {
      console.error('Greška prilikom dobijanja podataka o projektu:', error);
    });
}

  NewStatusList(statusName: string) {
    if (this.dropList.includes(statusName.toLowerCase())) {
        this.showNewStatusList = true;
    }
}

  getProjectByIdFromRoute(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id']; 
      if (projectId) {
        this.projectService.getProjectById(projectId)
          .subscribe((data: any) => {
            console.log('Podaci o projektu:', data);
            this.projectName = data.projectName;
            this.projectDate = data.deadline;
          }, error => {
            console.error('Greška prilikom dobijanja podataka o projektu:', error);
          });
      } else {
        console.error('ID projekta nije pronađen u URL-u.');
      }
    });
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
          this.todo = data.filter(task => task.taskStatusId === 1);
          this.progress = data.filter(task => task.taskStatusId === 2);
          this.done = data.filter(task => task.taskStatusId === 3);
          return data;
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          throw error; 
        })
      )
      .subscribe();
  }

  getProjectIdFromRoute(): any{
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
  
      const taskId = event.item.data.taskId;
      const newColumn = event.container.id; 
      const newStatusId = this.getStatusIdFromColumnName(newColumn);
  
      this.updateTaskStatus(taskId, newStatusId);
    }
  }

  updateTaskStatus(taskId: number, newStatusId: number) {
    this.taskService.updateTaskStatus(taskId, { TaskStatusId: newStatusId })
      .subscribe(
        () => console.log('Task status updated successfully.'),
        error => console.error('Error updating task status:', error)
      );
  }

  getStatusIdFromColumnName(columnName: string): number {
    const columnMap: { [key: string]: number } = {
      'todo': 1,
      'progress': 2,
      'done': 3,
    };
  
    if (columnName in columnMap) {
      return columnMap[columnName];
    }
  
    const newId = Object.keys(columnMap).length + 1; 
    columnMap[columnName] = newId; 
    return newId; 
  }


getTasksByStatus(statusId: number): any[] {
  switch (statusId) {
    case 1:
      return this.todo;
    case 2:
      return this.progress;
    case 3:
      return this.done;
    default:
      return [];
  }
}

  findTaskIndex(taskId: number, column: string): number {
      let taskList: any[];

      switch (column) {
        case 'todo':
          taskList = this.todo;
          break;
        case 'progress':
          taskList = this.progress;
          break;
        case 'done':
          taskList = this.done;
          break;
        default:
          return -1; 
      }

      const taskIndex = taskList.findIndex(task => task.taskId === taskId);
      return taskIndex;
  }

  deleteTask(column: string, index: number) {    
    if (column === 'todo') {
      this.todo.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'progress') {
      this.progress.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'done') {
      this.done.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    }
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Deleted successfully", duration: 3000});
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });

    dialogRef.componentInstance.taskAdded.subscribe(() => {
      this.loadTasksByProject(1); 
    });
  }

  openConfirmationDialog(column: string, index: number): void{
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: { column, index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteTask(result.column, result.index);
      }
    });
  }

  openTaskStatusDialog(): void {
    const dialogRef = this.dialog.open(AddTaskStatusComponent, {
        width: '500px',
        data: { projectId: this.projectId }
    });

    dialogRef.componentInstance.taskStatusAdded.subscribe((data: any) => {
      console.log(data);
      this.handleTaskStatusAdded(this.taskStatusAdded);
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
    });
}

  handleTaskStatusAdded(event: any) {
    this.loadTasksByProject(this.projectId);
    this.NewStatusList(this.statusName);
  }


}


