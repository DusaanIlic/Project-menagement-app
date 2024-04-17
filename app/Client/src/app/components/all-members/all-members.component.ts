import { Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Member } from '../../models/member';
import {RouterLink} from "@angular/router";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { Role } from '../../models/role';
import { AddMemberComponent } from '../add-member/add-member.component';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MemberInfoComponent } from '../member-info/member-info.component';
import {RoleOverviewComponent} from "../role-overview/role-overview.component";
import {environment} from "../../../environments/environment";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatRadioModule} from '@angular/material/radio';


@Component({
  selector: 'app-all-members',
  standalone: true,
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss',
  imports: [CommonModule, RouterLink, FormsModule, NgToastModule, NgOptimizedImage, MatTableModule, MatPaginatorModule, MatSortModule,MatRadioModule],
  providers: [DatePipe]
})
export class AllMembersComponent implements AfterViewInit{

  selectedRole: string = '';
  roles: Role[] = [];
  members : Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['avatar',  'firstName', 'roleName', 'email', 'tasks', 'date'];
  dataSource: any;
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private memberService: MemberService,  public dialog: MatDialog, private _ngToastService: NgToastService, private _liveAnnouncer: LiveAnnouncer) {
    this.filteredMembers = this.members;
  }

  ngOnInit(){
    this.getMembersFromServer();
    this.getRolesFromServer();
    this.filterMembersByRole(this.selectedRole);
    this.selectedRole = 'allMembers'; 
  }

  ngAfterViewInit(): void {
   
    
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterMembersByRole(role: string): void {
    if (role === 'allMembers') {
      this.dataSource = this.members;
    } else {
      this.dataSource = this.members.filter(member => this.getRoleName(member.roleId) === role);
    }
  }

  onRoleChange(event: any): void {
    this.selectedRole = event.target.value;
    this.filterMembersByRole(this.selectedRole);
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Member added successfully", duration: 3000});
  }

  getMembersFromServer(): void {
    this.memberService.getMembers().subscribe(
      (data: Member[]) => {
        this.members = data;
        this.filteredMembers = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log('Error fetching members:', error);
      }
    );
  }

  getRolesFromServer(): void {
    this.memberService.getRoles().subscribe(
      (data: Role[]) => {
        this.roles = data;
      },
      (error) => {
        console.log('Error fetching roles:', error);
      }
    );
  }

  getRoleName(roleId: number): any {
    if (!this.roles || this.roles.length === 0) {
      return 'Unknown';
    }

    const role = this.roles.find(r => r.id === roleId);

    return role ? role.name : 'Unknown';
  }


  
  search(): void {
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredMembers = [...this.filteredMembers];

    if (this.selectedRole) {
      switch (this.selectedRole) {
        case 'allMembers':
          break;
        case 'administrators':
        case 'projectManagers':
        case 'workers':
          filteredMembers = filteredMembers.filter(member => this.getRoleName(member.roleId) === this.selectedRole);
          break;
        default:
          break;
      }
    }

    if (searchTerm) {
      filteredMembers = filteredMembers.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm) ||
        member.lastName.toLowerCase().includes(searchTerm)
      );
    }
    else{
      filteredMembers = this.members;
    }

    this.dataSource = filteredMembers;
  }


  openMemberDialog(): void{
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.memberAdded.subscribe(() => {
      this.getMembersFromServer();
    });
  }

  openRoleDialog() {
    const dialogRef = this.dialog.open(RoleOverviewComponent, {
      width: '800px',
      height: '600px'
    });
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

