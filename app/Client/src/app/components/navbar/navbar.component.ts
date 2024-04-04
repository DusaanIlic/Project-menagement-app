import {Component, ElementRef, OnDestroy, Renderer2} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";

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
export class NavbarComponent implements OnDestroy {
  visible: boolean = false;

  constructor(private authService: AuthService, private renderer: Renderer2, private elementRef: ElementRef) {
    this.addClickOutsideListener();
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

  ngOnDestroy() {
    this.renderer.destroy();
  }
}
