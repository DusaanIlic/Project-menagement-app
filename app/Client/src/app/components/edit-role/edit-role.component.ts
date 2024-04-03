import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-role',
    standalone: true,
    templateUrl: './edit-role.component.html',
    styleUrl: './edit-role.component.scss',
    imports: [FormsModule, RouterModule, NgToastModule, MatDialogModule]
})


export class EditRoleComponent implements OnInit {

  roleId: number | undefined;

  members: { name: string }[] = [];
  filteredMembers: { name: string }[] = [];
  searchTerm: any;
  member: any;
  messageService: any;
  isDialogOpen: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
    private _ngToastService: NgToastService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roleId = +params['id'];
    });

    this.members = [
      {name: "Pera Peric"},
      {name: "Mika Mikic"},
      {name: "Zika Zikic"}
    ];

    this.filteredMembers = this.members;
  }

  filterMembers(searchTerm: string){
    this.filteredMembers = this.members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())  
    );
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Saved successfully", duration: 3000});
  }


}
