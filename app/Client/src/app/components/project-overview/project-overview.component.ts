import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { MemberService } from "../../services/member.service";
import { TaskService } from "../../services/task.service";
import { ProjectServiceGet } from "../../services/project.service";
import { AddMembersToProjectComponent } from "../add-members-to-project/add-members-to-project.component";
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  routeSub: any;
  projectId: number = 0;
  projectDetails: any; 

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private mService: MemberService,
    private tService: TaskService,
    private pService: ProjectServiceGet
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = this.getProjectIdFromUrl(params);
      this.getProjectDetails(); 
    });
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

  getProjectDetails() {
    this.pService.getProjectById(this.projectId).subscribe(
      (data) => {
        this.projectDetails = data;
        console.log('Project Details:', this.projectDetails);
      },
      (error) => {
        console.error('Error fetching project details:', error);
      }
    );
  }

  private getProjectIdFromUrl(params: any): number {
    return params['id'] ? +params['id'] : 0;
  }
}
