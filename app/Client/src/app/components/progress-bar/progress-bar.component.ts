import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {ProgressBarService} from "../../services/progress-bar.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    MatProgressBar,
    NgIf
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements AfterViewInit {
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;

  constructor(public progressBarService: ProgressBarService) {}

  ngAfterViewInit(): void {
    this.progressBarService.setProgressBar(this.progressBar);
    console.log(`Visibility: ${this.progressBarService.getVisibility()}`);
  }
}
