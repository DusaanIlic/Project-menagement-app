import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
  showStandalone: boolean = true;
  standaloneTasks: string = '- Standalone';

  toggleUncategorized() {
    this.showStandalone = !this.showStandalone;

    if (this.showStandalone)
      this.standaloneTasks = '- Standalone';
    else
      this.standaloneTasks = '+ Standalone';
  }
}
