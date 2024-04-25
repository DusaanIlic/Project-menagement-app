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
import { Task } from '../../models/task';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatCardModule, NgxChartsModule, MatButtonModule],
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
  tasks: Task[] = [];
  numberOfTasks: number = 0;
  taskStatusData: any[] = [];
  recentActivities: any[] = [];

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
    this.loadTasksByProject(this.projectId);
    this.getTeamLeaderInfo(this.projectId);
    this.fetchTaskStatusData();
    this.loadRecentActivity(this.projectId);
  }

  loadRecentActivity(projectId: number): void {
    this.pService.getRecentActivity(projectId).subscribe((data: any[]) => {
      this.recentActivities = data.slice(0, 5);
      console.log("aktivnosti", this.recentActivities);
      this.recentActivities.forEach(activity => {
        this.getTaskName(activity.taskId);
      });
    });
  }

  getTaskName(taskId: number): void {
    this.tService.getTaskById(taskId).subscribe((task: Task) => {
      // Pronađite odgovarajuću aktivnost i ažurirajte naziv zadatka
      const activityToUpdate = this.recentActivities.find(activity => activity.taskId === taskId);
      if (activityToUpdate) {
        activityToUpdate.taskName = task.taskName; 
      }
    });
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
      //console.log(data);
    })
  }

  loadTasksByProject(projectId: number): void {
    this.tService.getTasksByProject(projectId).subscribe((data: Task[])=>{
      this.tasks = data;
      this.numberOfTasks = this.tasks.length;
      //console.log(this.members);
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

  addMembersToProject() {
    this.openDialog();
  }

  addTasksToProject(){
    this.openTaskDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMembersToProjectComponent, {
      width : '800px',
      height : '400px',
      data: this.projectId
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px',
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

  fetchTaskStatusData() {
    this.tService.getTasksByProject(this.projectId).subscribe((tasks: Task[]) => {
      const statusCounts = this.countTasksByStatus(tasks);
      this.taskStatusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count
      }));
    });
  }

  countTasksByStatus(tasks: Task[]): { [status: string]: number } {
    const statusCounts: { [status: string]: number } = {};
    tasks.forEach(task => {
      if (statusCounts[task.taskStatus]) {
        statusCounts[task.taskStatus]++;
      } else {
        statusCounts[task.taskStatus] = 1;
      }
    });
    return statusCounts;
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
