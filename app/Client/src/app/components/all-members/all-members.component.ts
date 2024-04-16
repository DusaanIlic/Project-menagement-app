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

@Component({
  selector: 'app-all-members',
  standalone: true,
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss',
  imports: [CommonModule, RouterLink, FormsModule, NgToastModule, NgOptimizedImage, MatTableModule, MatPaginatorModule],
  providers: [DatePipe]
})
export class AllMembersComponent implements AfterViewInit{

  selectedRole: string = '';
  roles: Role[] = [];
  members : Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource = new MatTableDataSource<Member>(this.members);
  displayedColumns: string[] = ['avatar', 'name', 'role', 'email', 'tasks', 'date'];


  ngAfterViewInit(): void {
    this.getMembersFromServer();
    this.getRolesFromServer();
    this.filterMembersByRole(this.selectedRole);
    this.selectedRole = 'allMembers';
  }

  filterMembersByRole(role: string): void {
    if (role === 'allMembers') {
      this.filteredMembers = this.members;
    } else {
      this.filteredMembers = this.members.filter(member => this.getRoleName(member.roleId) === role);
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


  constructor(private memberService: MemberService,  public dialog: MatDialog, private _ngToastService: NgToastService) {
    this.filteredMembers = this.members;
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

    this.filteredMembers = filteredMembers;
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


  sortMembersBy(event: any): void {
    const option = event.target.value;
    switch(option) {
      case 'name':
        this.sortByName();
        break;
      case 'role':
        this.sortByRole();
        break;
      case 'email':
        this.sortByEmail();
        break;
      // case 'tasks':
      //   this.sortByTasks();
      //   break;
      case 'date':
        this.sortByDate();
        break;
      default:
        break;
    }
  }

  sortByName() {
    this.filteredMembers.sort((a, b) => {
      return (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName);
    });
  }

  sortByRole() {
    this.filteredMembers.sort((a, b) => {
      return this.getRoleName(a.roleId).localeCompare(this.getRoleName(b.roleId));
    });
  }

  sortByEmail() {
    this.filteredMembers.sort((a, b) => {
      return a.email.localeCompare(b.email);
    });
  }

  // sortByTasks() {
  //   this.filteredMembers.sort((a, b) => {
  //     return a?.numberOfTasks - b?.numberOfTasks;
  //   });
  // }

  sortByDate() {
    this.filteredMembers.sort((a, b) => {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    });
  }

    protected readonly environment = environment;
}

