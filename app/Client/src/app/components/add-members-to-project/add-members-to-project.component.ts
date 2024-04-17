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

@Component({
  selector: 'app-add-members-to-project',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgToastModule,
    NgxEditorModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-members-to-project.component.html',
  styleUrl: './add-members-to-project.component.scss'
})
export class AddMembersToProjectComponent implements OnInit{

  membersOnThisProject : Member[] = [];
  allMembers : Member[] = [];


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
    this.mService.getMembers().subscribe((members2 : Member[]) =>{
      this.allMembers = members2;
      console.log(this.allMembers)
    })

    this.pService.getMembersByProjectId(this.projectId).subscribe((members1 : Member[]) =>{
      this.membersOnThisProject = members1;
      console.log(this.membersOnThisProject)
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

  assignRemove(event : any, memberId: number)
  {
    console.log(event.target.checked) // If true - assign if false - remove
    const membersList = [memberId];
    console.log(membersList)


    if(event.target.checked) // assign
    {

      this.pService.assignMemberToProject(membersList, this.projectId).subscribe({
        next : data =>{
          this.showMessage()
          this.fetchMembersOnProject()
        },
        error : error =>{
          this.showMessageError()
        }
      })
    }
    else //remove
    {
      this.pService.removeMemberFromProject(memberId, this.projectId).subscribe({
        next : data =>{
          this.showMessage()
          this.fetchMembersOnProject()
        },
        error : error =>{
          this.showMessageError()
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

}
