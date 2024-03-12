import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";
import { ProfileDropdownMenuComponent } from "../profile-dropdown-menu/profile-dropdown-menu.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [
        NgOptimizedImage,
        ProfileDropdownMenuComponent,
        CommonModule
    ]
})
export class HeaderComponent {

    visible:boolean = false;
    notVisible:boolean = true;
dropdownShow() {
  this.visible = !this.visible;
  this.notVisible = !this.notVisible;
}
  title: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.root;
        while (child.firstChild) {
          child = child.firstChild;
        }
        if (child.snapshot.data['title']) {
          return child.snapshot.data['title'];
        }
        return '';
      })
    ).subscribe((title: string) => {
      this.title = title;
    });
  }
}
