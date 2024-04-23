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
import { MatCardModule } from '@angular/material/card';
import { MemberInfoComponent } from '../member-info/member-info.component';
import { Member } from '../../models/member';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatCardModule],
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  routeSub: any;
  projectId: number = 0;
  projectDetails: any; 
  teamLeaderInfo: any;
  members : Member[] = [];
  numberOfMembers: number = 0;

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
    this.fetchMembersOnProject();
    this.getTeamLeaderInfo(this.projectId);
  }

  calculateDaysRemaining(projectEndDate: Date): number {
    const currentDate = new Date();
    const endDate = new Date(projectEndDate);
    const timeDifference = endDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }
  
  fetchMembersOnProject()
  {
    this.pService.getProjectMembers(this.projectId).subscribe((data : Member[])=>{
      this.members = data;
      this.numberOfMembers = this.members.length;
      console.log(data);
    })
  }

  getTeamLeaderInfo(projectId: number): void {
    this.pService.getProjectById(projectId)
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

  openMemberInfoDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberInfoComponent, {
      data: { member }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog zatvoren');
    });
  }
}
