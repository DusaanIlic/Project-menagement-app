import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Member} from "../../models/member";
import {MemberService} from "../../services/member.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgIf,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  authorizedMember: Member | null = null;

  constructor(private authService: AuthService, private renderer: Renderer2,
                private memberService: MemberService, private elementRef: ElementRef) {
    this.addClickOutsideListener();
  }

  ngOnInit() {
    this.memberService.getAuthorizedMember().subscribe(authorizedMember => {
      this.authorizedMember = authorizedMember;
    })
  }

  ngOnDestroy() {
    this.renderer.destroy();
  }

  dropdownShow() {
    this.visible = !this.visible;
  }

  logout() {
    this.authService.logout();
  }

  addClickOutsideListener() {
    this.renderer.listen('document', 'click', (event) => {
      if (!this.isClickedInsideComponent(event.target)) {
        this.visible = false;
      }
    });
  }

  isClickedInsideComponent(target: any): boolean {
    return this.elementRef.nativeElement.contains(target);
  }
}
