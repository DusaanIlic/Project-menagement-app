import {Component, OnInit, ViewChild} from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { environment } from '../../../environments/environment';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MemberInfoComponent } from '../member-info/member-info.component';
import { ConfirmationAssigneeComponent } from '../confirmation-assignee/confirmation-assignee.component';
import { AddMembersToProjectComponent } from '../add-members-to-project/add-members-to-project.component';

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
    MatTableModule,
    MatRadioGroup, MatPaginatorModule, MatSortModule
  ],
  templateUrl: './all-assignees.component.html',
  styleUrl: './all-assignees.component.scss'
})
export class AllAssigneesComponent implements OnInit{
  private routeSub: any;
  selectedStatus: string = '';
  assignees : Member[] = [];
  filteredAssignees : Member[] = [];
  projectId : number = 0;
  searchTerm: string = '';
  displayedColumns: string[] = ['avatar',  'firstName', 'roleName', 'email', 'status', 'date', 'action'];
  dataSource: any;
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private route: ActivatedRoute,
              private pService : ProjectServiceGet,
              private tService : TaskService,
              private mService : MemberService,
              public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) { }



  ngOnInit(): void
  {
    this.routeSub = this.route.params.subscribe((params : any) => {
      this.projectId = params['id'];
      this.fetchMembersOnProject();
      this.selectedStatus = 'allAssignees';
    })
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  fetchMembersOnProject()
  {
    this.pService.getProjectMembers(this.projectId).subscribe((data : Member[])=>{
      this.assignees = data;
      this.filteredAssignees = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(data);
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

  openConfirmationDialog(assignee: Member): void{
    const dialogRef = this.dialog.open(ConfirmationAssigneeComponent, {
      width: '500px',
      data: { assignee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.removeAssignee(assignee);
      }
    });
  }

  removeAssignee(assignee: Member)
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

  openRoleDialog() {
    const dialogRef = this.dialog.open(ProjectRoleOverviewComponent, {
      width: '800px',
      height: '600px',
      data: {
        projectId: this.projectId
      }
    });
  }

  search(): void {
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredAssignees = [...this.filteredAssignees];

    /*if (this.selectedStatus) {
      switch (this.selectedStatus) {
        case 'allStatuses':
          filteredAssignees = filteredAssignees.filter(member => this.selectedStatus);
          break;
        default:
          break;
      }
    }*/

    if (searchTerm) {
      filteredAssignees = filteredAssignees.filter(assignee =>
        assignee.firstName.toLowerCase().includes(searchTerm) ||
        assignee.lastName.toLowerCase().includes(searchTerm) ||
        assignee.email.toLowerCase().includes(searchTerm)
      );
    }
    else{
      filteredAssignees = this.assignees;
    }

    this.dataSource = filteredAssignees;
  }

  openMemberInfoDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberInfoComponent, {
      data: { member }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog zatvoren');
    });
  }

  protected readonly environment = environment;
}
