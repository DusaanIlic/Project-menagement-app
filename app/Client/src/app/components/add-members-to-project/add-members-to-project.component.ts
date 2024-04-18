import {Component, Inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {NgxEditorModule} from "ngx-editor";
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TaskService} from "../../services/task.service";
import {MemberService} from "../../services/member.service";
import {ProjectServiceGet} from "../../services/project.service";
import {Member} from "../../models/member";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-add-members-to-project',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgToastModule,
    NgxEditorModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatProgressSpinner
  ],
  templateUrl: './add-members-to-project.component.html',
  styleUrl: './add-members-to-project.component.scss'
})
export class AddMembersToProjectComponent implements OnInit{

  membersOnThisProject : Member[] = [];
  allMembers : Member[] = [];
  teamLider : any;
  waiting: boolean = false;


  constructor(public dialogRef: MatDialogRef<AddMembersToProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public projectId: number,
              private tService : TaskService,
              private mService : MemberService,
              private _ngToastService: NgToastService,
              private pService: ProjectServiceGet) { }


  ngOnInit(): void
  {
    this.fetchMembersOnProject();

  }

  fetchMembersOnProject()
  {


    this.pService.getMembersByProjectId(this.projectId).subscribe((members1 : Member[]) =>{
      this.membersOnThisProject = members1;
      console.log(this.membersOnThisProject)
    })

    this.pService.getProjectById(this.projectId).subscribe((data : any)=>{
      this.teamLider = data.teamLider;
      console.log(this.teamLider)
      this.mService.getMembers().subscribe((members2 : Member[]) =>{
        this.allMembers = members2;
        console.log(this.allMembers)
      });
    })

  }

  isMemberOnProject(mId : number): boolean
  {
    for(let i=0;i<this.membersOnThisProject.length;i++)
    {
      if(mId === this.membersOnThisProject[i].id)
        return true;
    }
    return false;
  }

  isMemberTeamLeader(mId : number) : boolean
  {
    if(mId === this.teamLider.id)
      return true;
    return false
  }


  assignRemove(event : any, memberId: number)
  {
    console.log(event)
    const membersList = [memberId];


    if(event) // assign
    {
      this.waiting = true;
      this.pService.assignMemberToProject(membersList, this.projectId).subscribe({
        next : data =>{
          this.showMessage()
          this.fetchMembersOnProject()
          this.waiting = false;
        },
        error : error =>{
          this.showMessageError()
          this.waiting = false;
        }
      })
    }
    else //remove
    {
      this.waiting = true;
      this.pService.removeMemberFromProject(memberId, this.projectId).subscribe({
        next : data =>{
          this.showMessage()
          this.fetchMembersOnProject()
          this.waiting = false;
        },
        error : error =>{
          this.showMessageError()
          this.waiting = false;
        }
      })
    }
  }

  showMessage()
  {
    this._ngToastService.success({detail: "Success Message", summary: "Member add/delete successfully!", duration: 3000});
  }

  showMessageError()
  {
    this._ngToastService.error({detail: "Error Message", summary: "Member add/delete failed!", duration: 3000});
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  protected readonly environment = environment;
}
