import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {MemberService} from "../../services/member.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {Subscription} from "rxjs";

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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  member: Member | null | undefined;
  avatarUrl: string | undefined;

  buttons = [
    { link: '/dashboard', text: 'Dashboard', icon: 'home' },
    { link: '/projects/all', text: 'Projects', icon: 'insert_drive_file' },
    { link: '/members/all', text: 'Members', icon: 'person' },
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getAuthenticatedMember().subscribe(member => {
      this.member = member;
    });

    this.authService.getAuthenticatedMembersAvatar().subscribe(avatarUrl => {
      this.avatarUrl = avatarUrl;
    });
  }

  logout() {
    this.authService.logout();
  }

}
