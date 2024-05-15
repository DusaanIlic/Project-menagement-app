import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {MemberService} from "../../services/member.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {Observable, Subscription} from "rxjs";
import {ThemeService} from "../../services/theme.service";
import {Option} from "@angular/cli/src/command-builder/utilities/json-schema";
import {Theme} from "../../models/theme";
import theme from "tailwindcss/defaultTheme";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatToolbar,
    MatButton,
    MatAnchor,
    NgForOf,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    AsyncPipe,
    MatRadioButton,
    MatRadioGroup,
    MatBadge,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  member: Member | null | undefined;
  avatarUrl: string | undefined;
  options$: Observable<Theme[]> = this.themeService.getThemeOptions();
  defaultTheme: any;

  buttons = [
    { link: '/dashboard', text: 'Dashboard', icon: 'home' },
    { link: '/projects/all', text: 'Projects', icon: 'insert_drive_file' },
    { link: '/members/all', text: 'Members', icon: 'person' },
  ];

  constructor(private authService: AuthService, private router: Router,
                private themeService: ThemeService) { }

  ngOnInit() {
    this.authService.getAuthenticatedMember().subscribe(member => {
      this.member = member;
    });

    this.authService.getAuthenticatedMembersAvatar().subscribe(avatarUrl => {
      this.avatarUrl = avatarUrl;
    });

    this.defaultTheme = localStorage.getItem('selected-theme');

    if (!this.defaultTheme) {
      this.defaultTheme = 'indigo-pink';
    }

    this.themeService.setTheme(this.defaultTheme);
  }

  changeTheme(themeToSet: string) {
    this.themeService.setTheme(themeToSet);
    localStorage.setItem('selected-theme', themeToSet);
    this.defaultTheme = themeToSet;
  }

  logout() {
    this.authService.logout();
  }
}
