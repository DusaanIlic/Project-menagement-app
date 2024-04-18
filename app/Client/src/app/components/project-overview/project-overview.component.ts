import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {MemberService} from "../../services/member.service";
import {TaskService} from "../../services/task.service";
import {ProjectServiceGet} from "../../services/project.service";
import {AddMembersToProjectComponent} from "../add-members-to-project/add-members-to-project.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-project-overview',
  standalone: true,
    imports: [
        MatButton
    ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit{

  routeSub : any;
  projectId : number = 1;

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private mService : MemberService,
              private tService : TaskService,
              private pService : ProjectServiceGet) { }


  ngOnInit()
  {
    this.routeSub = this.route.params.subscribe(params =>{
      this.projectId = params['id'];
    })
  }


  addMembersToProjects() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMembersToProjectComponent, {
      data: this.projectId
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
