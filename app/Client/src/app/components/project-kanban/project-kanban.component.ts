import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AddTaskStatusComponent } from '../add-task-status/add-task-status.component';
import { ProjectServiceGet } from '../../services/project.service';
import { DatePipe } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Member } from '../../models/member';
import { MemberInfoComponent } from '../member-info/member-info.component';
import { MatCardModule } from '@angular/material/card';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-project-kanban',
  standalone: true,
  templateUrl: './project-kanban.component.html',
  styleUrl: './project-kanban.component.scss',
  providers: [DatePipe],
  imports: [CdkDropList,MatSelectModule,MatSlideToggleModule ,MatFormFieldModule,  ReactiveFormsModule , MatExpansionModule,MatCheckboxModule, FormsModule,MatDividerModule,MatIconModule, MatButtonModule ,CdkDrag,
    CdkDropListGroup, NgFor, FormsModule, CommonModule, NgToastModule, MatDialogModule, AddTaskComponent, AddTaskStatusComponent, MatCardModule]
})

export class ProjectKanbanComponent implements OnInit {
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];
  dropList: any[] = ['to do', 'progress', 'done'];
  newStatuses: any[] = [];

  columnVisibility: { [key: string]: boolean } = {};

  projectId: number = 0;
  projectName: string = "";
  projectDate: Date | undefined;

  @Output() taskStatusAdded: EventEmitter<any> = new EventEmitter<any>();
  teamLeaderInfo: any;

  constructor(private taskService: TaskService, private projectService: ProjectServiceGet, private cdr: ChangeDetectorRef,  private _ngToastService: NgToastService, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.getProjectIdFromRoute();
    this.dropList.forEach(column => {
      this.columnVisibility[column] = true;
  });
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
          this.todo = data.filter(task => task.taskStatusId === 1).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.progress = data.filter(task => task.taskStatusId === 2).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.done = data.filter(task => task.taskStatusId === 3).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
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
  
  openMemberInfoDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberInfoComponent, {
      data: { member }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog zatvoren');
    });
  }

  getProjectIdFromRoute(): any{
    this.route.params.subscribe(params => {
      this.projectId = params['id'];

      this.loadTasksByProject(this.projectId);
      this.getTeamLeaderInfo(this.projectId);
      this.getProjectByIdFromRoute();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        const taskId = event.item.data.taskId;
        const newColumn = event.container.id;
        const newStatusId = this.getStatusIdFromColumnName(newColumn);

        if (event.container.data.length === 0) {
            event.container.data.push(event.previousContainer.data[event.previousIndex]);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }

        this.updateTaskStatus(taskId, newStatusId)
            .subscribe(
                () => {
                  this.loadTasksByProject(this.projectId);
                  //console.log('Task status updated successfully.')
                },
                error => console.error('Error updating task status:', error)
            );
    }
}

  updateTaskStatus(taskId: number, newStatusId: number): Observable<any> {
    return this.taskService.updateTaskStatus(taskId, newStatusId);
  }

  getStatusIdFromColumnName(columnName: string): number {
    const columnMap: { [key: string]: number } = {
      'to do': 1,
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
      return this.progress
    case 3:
      return this.done;
    default:
      return [];
  }
  }

  findTaskIndex(taskId: number, column: string): number {
      let taskList: any[];

      switch (column) {
        case 'to do':
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
    if (column === 'to do') {
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
    } else if (column === 'completed') {
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

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.newStatuses.push(result.name);
            // Ažuriranje dropList-a sa novim statusom
            this.dropList.push(result.name.toLowerCase());
            console.log(this.dropList);
        }
    });
}

  protected readonly environment = environment;
}
