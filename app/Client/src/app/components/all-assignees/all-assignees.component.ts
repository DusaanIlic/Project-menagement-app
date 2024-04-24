import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Member} from "../../models/member";
import {ProjectServiceGet} from "../../services/project.service";
import {TaskService} from "../../services/task.service";
import {MemberService} from "../../services/member.service";
import {FormsModule} from "@angular/forms";
import {Task} from "../../models/task";
import {TaskOverviewComponent} from "../task-overview/task-overview.component";
import {AddAssigneeComponent} from "../add-assignee/add-assignee.component";
import {MatDialog} from "@angular/material/dialog";
import {RoleOverviewComponent} from "../role-overview/role-overview.component";
import {ProjectRoleOverviewComponent} from "../project-role-overview/project-role-overview.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {AddMembersToProjectComponent} from "../add-members-to-project/add-members-to-project.component";

@Component({
  selector: 'app-all-assignees',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DatePipe,
    MatButton,
    MatMenu,
    MatMenuItem,
    NgForOf,
    NgIf,
    MatMenuTrigger,
    RouterLink,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './all-assignees.component.html',
  styleUrl: './all-assignees.component.scss'
})
export class AllAssigneesComponent implements OnInit{
  private routeSub: any;
  assignees : Member[] = [];
  activeAssignees : Member[] = [];
  inactiveAssignees : Member[] = [];
  selectedTable: string = 't1';
  projectId : number = 0;

  constructor(private route: ActivatedRoute,
              private pService : ProjectServiceGet,
              private tService : TaskService,
              private mService : MemberService,
              public dialog: MatDialog) { }



  ngOnInit(): void
  {
    this.routeSub = this.route.params.subscribe((params : any) => {
      this.projectId = params['id'];
      this.fetchMembersOnProject();
    })
  }

  fetchMembersOnProject()
  {
    this.pService.getProjectMembers(this.projectId).subscribe((data : Member[])=>{
      this.assignees = data;
      console.log(data);

      for(let i=0;i<this.assignees.length;i++)
      {
        if(this.assignees[i].status === 'Active')
          this.activeAssignees.push(this.assignees[i]);
        else
          this.inactiveAssignees.push(this.assignees[i])
      }
    })
  }

  clickMethod()
  {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMembersToProjectComponent, {
      width : '800px',
      height : '400px',
      data: this.projectId
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      console.log('The dialog was closed');
      this.fetchMembersOnProject()
    });
  }

  removeAssignee(assignee: Member)
  {
    console.log("DELETING...")

      if(confirm("Are you sure you want to remove member?"))
      {
        this.pService.removeMemberFromProject(assignee.id, this.projectId).subscribe({
          next : data =>{
            console.log("Removed successfully.");
          },
          error : error =>{
            console.log("Error removing");
            this.fetchMembersOnProject()
          }
        })
      }
    }

  openRoleDialog() {
    const dialogRef = this.dialog.open(ProjectRoleOverviewComponent, {
      width: '800px',
      height: '600px',
      data: {
        projectId: this.projectId
      }
    });
  }
}
