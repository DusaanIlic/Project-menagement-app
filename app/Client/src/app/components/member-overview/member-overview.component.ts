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

  constructor(public dialog: MatDialog, private route: ActivatedRoute,
                private mService : MemberService, private tService : TaskService,
                  private pService : ProjectServiceGet) {}

  member : Member = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    roleId: 1,
    roleName: 'Administrator',
    dateAdded: new Date(1, 2, 3),
    country: '',
    city: '',
    github: '',
    dateOfBirth: new Date(1, 2, 3,),
    linkedin: '',
    status: '',
    phoneNumber: ''
  };

  p? : Project;
  projects : Project[] = [];
  tasks : Task[] = [];
  mRole : string = "";

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.member.id = params['id'];

      this.mService.getRoleById(this.member.id).subscribe((role : any) => {
        this.mRole = role.name;
      })

      this.tService.getTasksByMember(this.member.id).subscribe((data : Task[]) =>{
       this.tasks = data;
      // console.log(data);
       for(let i=0;i<this.tasks.length;i++)
        {

          this.pService.getProjectById(this.tasks[i].projectId).subscribe((project : Project) => {
            //console.log(project)
            this.tasks[i].projectName = project.projectName;
          })
         // console.log("i:",i)
          this.tService.getTaskPriority(this.tasks[i].taskPriorityId).subscribe((data : any) =>{
           // console.log(data);
            this.tasks[i].taskPriority = data.name;
           // console.log("i:",i)
          })
        }
      })
   })
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
