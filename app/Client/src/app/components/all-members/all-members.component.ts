import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member';
import {RouterLink} from "@angular/router";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { Role } from '../../models/role';

@Component({
    selector: 'app-all-members',
    standalone: true,
    templateUrl: './all-members.component.html',
    styleUrl: './all-members.component.scss',
    imports: [CommonModule, RouterLink, FormsModule]
})
export class AllMembersComponent implements OnInit{

    roles: Role[] = [];
    members : Member[] = [];
    filteredMembers: Member[] = [];
    searchQuery: string = '';
    sortByName = true;
    sortByEmail = true;
    sortByDate = true;

    ngOnInit(): void {
        this.getMembersFromServer();
        this.getRolesFromServer();
        console.log(this.roles);
    }

    getMembersFromServer(): void {
      this.memberService.getMembers().subscribe(
        (data: Member[]) => {
          this.members = data;
          this.filteredMembers = data;
          this.sortNames();
          this.sortEmails();
          this.sortDates();
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

    getRoleName(roleId: number): string {
      const role = this.roles.find(r => r.id === roleId) as { id: number; name: string } | undefined;
      return role ? role.name : 'Unknown';
    }
  


    constructor(private memberService: MemberService) {
        this.filteredMembers = this.members;
        this.sortNames();
        this.sortEmails();
        this.sortDates();
    }

    search(): void {
      if (!this.searchQuery.trim()) {
        this.filteredMembers = this.members;
        return;
      }
      const regex = new RegExp(this.searchQuery.trim(), 'i');
      this.filteredMembers = this.members.filter(member =>
        regex.test(member.firstName) || regex.test(member.lastName)
      );
  }
  

  switchSortName()
  {
    this.sortByName = !this.sortByName;
    this.sortNames();
  }

  switchSortEmail()
  {
    this.sortByEmail = !this.sortByEmail;
    this.sortEmails();
  }

  switchSortDate()
  {
    this.sortByDate = !this.sortByDate;
    this.sortDates();
  }

  sortNames() {
    if (this.sortByName) {
      this.filteredMembers.sort((a, b) => {
        if (a.firstName !== b.firstName) {
          return a.firstName.localeCompare(b.firstName);
        }
        return a.lastName.localeCompare(b.lastName);
      });
    } else {
      this.filteredMembers.sort((a, b) => {
        if (a.firstName !== b.firstName) {
          return b.firstName.localeCompare(a.firstName);
        }
        return b.lastName.localeCompare(a.lastName);
      });
    }
}



  sortEmails()
  {
    
    if(this.sortByEmail)
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].email <= this.filteredMembers[i].email)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
    else
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].email > this.filteredMembers[i].email)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
  }


  sortDates()
  {
    
    if(this.sortByDate)
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].dateAdded <= this.filteredMembers[i].dateAdded)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
    else
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].dateAdded > this.filteredMembers[i].dateAdded)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
  }
}

