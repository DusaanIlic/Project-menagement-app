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
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";


@Component({
  selector: 'app-all-members',
  standalone: true,
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss',
  imports: [CommonModule, RouterLink, FormsModule, NgToastModule, NgOptimizedImage, MatTableModule, MatPaginatorModule, MatSortModule, MatRadioModule, MatButton, MatDivider, MatFormField, MatInput, MatLabel, MatIcon, MatSelect, MatOption, MatMenu, MatMenuItem, MatMenuTrigger],
  providers: [DatePipe]
})
export class AllMembersComponent implements OnInit, AfterViewInit{
  selectedRole: number = 0;
  defaultRole: number = 0;
  roles: Role[] = [];
  members : Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['avatar',  'firstName', 'roleName', 'email', 'tasks', 'date', 'actions'];
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
    this.selectedRole = 0;
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

  filterMembersByRole(role: number): void {
    this.dataSource.data = this.members.filter(member => role == 0 || member.roleId == role);
  }

  onRoleChange(event: any): void {
    this.selectedRole = event;
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



  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
