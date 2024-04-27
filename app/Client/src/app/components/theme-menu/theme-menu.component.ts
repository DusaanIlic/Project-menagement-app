import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Theme} from "../../models/theme";
import {ThemeService} from "../../services/theme.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-theme-menu',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    NgForOf,
    MatMenuItem
  ],
  templateUrl: './theme-menu.component.html',
  styleUrl: './theme-menu.component.scss'
})
export class ThemeMenuComponent {
  @Input() options!: any;
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private themeService: ThemeService) { }

  changeTheme(themeToSet: string) {
    this.themeChange.emit(themeToSet);
  }
}
