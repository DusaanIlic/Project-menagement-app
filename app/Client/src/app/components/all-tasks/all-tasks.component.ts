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
  showUncategorized: boolean = true;
  uncategorizedCategory: string = '- Uncategorized';

  toggleUncategorized() {
    this.showUncategorized = !this.showUncategorized;

    if (this.showUncategorized)
      this.uncategorizedCategory = '- Uncategorized';
    else
      this.uncategorizedCategory = '+ Uncategorized';
  }
}
