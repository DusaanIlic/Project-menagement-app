import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ActivatedRoute, RouterLink} from "@angular/router";

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
  assignes : any[] = [1];

  clickMethod()
  {
  }



  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void
  {
    this.routeSub = this.route.params.subscribe((params : any) => {
      console.log(params['id']);
    })
  }
}
