import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {MemberService} from "../../services/member.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
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
import {SignalRService} from "../../services/signal-r.service";
import {Notification} from "../../models/notification";
import {List} from "postcss/lib/list";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

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
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  member: Member | null | undefined;
  avatarUrl: string | undefined;
  options$: Observable<Theme[]> = this.themeService.getThemeOptions();
  defaultTheme: any;
  notRead = 0;
  today: Date = new Date();
  notifications: Notification[] = [];

  buttons = [
    { link: '/dashboard', text: 'Dashboard', icon: 'home' },
    { link: '/projects/all', text: 'Projects', icon: 'insert_drive_file' },
    { link: '/members/all', text: 'Members', icon: 'person' },
  ];

  constructor(private authService: AuthService, private router: Router,
                private themeService: ThemeService, private signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();

    this.authService.getAuthenticatedMember().subscribe(member => {
      this.member = member;
    });

    this.authService.getAuthenticatedMembersAvatar().subscribe(avatarUrl => {
      this.avatarUrl = avatarUrl;
    });

    this.signalRService.getNotification().subscribe({
      next: data => {
        if (data != null) {
          data.createdAt = new Date(data.createdAt);
          this.notifications.unshift(data);
          this.notRead += 1;
        }
      },
      error: err => {
        console.log('failed receiving notification');
      }
    })

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

  clearNotifications() {
    this.notRead = 0;
  }
}
