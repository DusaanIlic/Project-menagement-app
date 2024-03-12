import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";
import { ProfileDropdownMenuComponent } from "../profile-dropdown-menu/profile-dropdown-menu.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [
        NgOptimizedImage,
        ProfileDropdownMenuComponent
    ]
})
export class HeaderComponent {

    visible:boolean = false;
dropdownShow() {
  this.visible = !this.visible;
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
