import { Component } from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from "../task-overview/task-overview.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Role } from '../../models/role';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { ProjectServiceGet } from '../../services/project.service';
import { Project } from '../../models/project';


@Component({
    selector: 'app-member-overview',
    standalone: true,
    templateUrl: './member-overview.component.html',
    styleUrl: './member-overview.component.scss',
    imports: [CommonModule, TaskOverviewComponent, MatDialogModule]
})
export class MemberOverviewComponent{


  member : Member = {
    id: 1,
    firstName: '',
    lastName: '',
    email: '',
    roleId: 1,
    dateAdded: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    status: '',
    country: '',
    city: '',
    dateOfBirth: new Date()
  };

  p? : Project;
  projects : Project[] = [];
  activities : taskActivity[] = [];
  tasks : Task[] = [];
  expanded : boolean[] = [];
  mRole : string = "";

  async getMemberId()
  {
    await this.route.params.subscribe(params => {
      this.member.id = params['id'];
    });
  }

  async fetchMemberFromDB()
  {
    this.mService.getMemberById(this.member.id).subscribe((member : Member) => 
    {
      this.member = member;
    });

    this.mService.getRoleById(this.member.roleId).subscribe((role : Role) =>
    {
      this.mRole = role.name;
    })
  }

  getTasks()
{
  this.tService.getTasksByMember(this.member.id).subscribe((tasks : Task[]) =>
  {
    this.tasks = tasks;
    this.getProjects();
  })
}

getProjects()
{
  for(let i=0;i<this.tasks.length;i++)
    {
      this.pService.getProjectById(this.tasks[i].projectId).subscribe((project : Project) => 
        {
          this.p = project;
          this.projects.push(this.p);
        })
    }
    
  
}

async getMember()
{
  await this.getMemberId();
  this.fetchMemberFromDB();
}




  constructor(public dialog: MatDialog, private route: ActivatedRoute, private mService : MemberService, private tService : TaskService, private pService : ProjectServiceGet) {

    this.getMember();
    this.getTasks();

    for(let i=0;i<this.activities.length;i++)
    {
     // if(!this.projects.includes(this.activities[i].projectName.trim()))
      //this.projects.push(this.activities[i].projectName);
    }

    for(let i=0;i<this.projects.length;i++)
    {
      this.expanded.push(false);
    }

  }



  //////////////////////////////////////////////////////


hideNshow(i: number) 
{
  this.expanded[i] = !this.expanded[i];
}
  
  

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
