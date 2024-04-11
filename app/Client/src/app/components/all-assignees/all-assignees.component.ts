import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Member} from "../../models/member";
import {ProjectServiceGet} from "../../services/project.service";
import {TaskService} from "../../services/task.service";
import {MemberService} from "../../services/member.service";

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
    RouterLink
  ],
  templateUrl: './all-assignees.component.html',
  styleUrl: './all-assignees.component.scss'
})
export class AllAssigneesComponent implements OnInit{
  private routeSub: any;
  assignees : Member[] = [];

  constructor(private route: ActivatedRoute,
              private pService : ProjectServiceGet,
              private tService : TaskService,
              private mService : MemberService) { }



  ngOnInit(): void
  {
    this.routeSub = this.route.params.subscribe((params : any) => {
      console.log(params['id']);
      this.pService.getProjectMembers(params['id']).subscribe((data : Member[])=>{
        this.assignees = data;
        console.log(data);
      })
    })
  }

  clickMethod()
  {
  }
}
