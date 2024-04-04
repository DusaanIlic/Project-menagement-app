import { Component, OnInit, inject} from '@angular/core';
import { Member } from '../../models/member';
import { taskActivity } from '../../models/taskActivity';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from "../task-overview/task-overview.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/member.service';


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
    roleId: 0,
    dateAdded: ''
  };

  projects : string[] = [];
  activities : taskActivity[] = [];
  expanded : boolean[] = [];


  async getMemberId()
  {
    this.route.params.subscribe(params => {
      this.member.id = params['id'];
      console.log(params['id']);
    });
  }

  async fetchMemberFromDB()
  {
    this.mService.getMemberById(this.member.id).subscribe((member : Member) => {
      console.log(member);
    });
  }

async getMember()
{
  await this.getMemberId();
  this.fetchMemberFromDB();
}

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private mService : MemberService) {

    this.getMember();
    

    for(let i=0;i<this.activities.length;i++)
    {
      if(!this.projects.includes(this.activities[i].projectName.trim()))
      this.projects.push(this.activities[i].projectName);
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
  
  

  openDialog(id: number): void {
    console.log(this.activities[id]);
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
