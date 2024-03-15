import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Member} from "../../models/member";
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit {

/*openForm() {
throw new Error('Method not implemented.');
}*/
  roleId: number | undefined;

  members: { name: string }[] = [];
  filteredMembers: { name: string }[] = [];
  searchTerm: any;
  member: any;

  constructor(private router: Router, private route: ActivatedRoute){}

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

  saveChanges(): void {
    this.router.navigate(['/roles/all'], { queryParams: {saved:true} });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { saved: true },
      queryParamsHandling: 'merge'
    });
  }

}
