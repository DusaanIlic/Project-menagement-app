import { Injectable } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private progressBar: any;
  private isHidden = true;

  getVisibility(): boolean {
    return this.isHidden;
  }

  setProgressBar(progressBar: MatProgressBar) {
    this.progressBar = progressBar;
  }

  show() {
    if (this.progressBar) {
      console.log('SHOWED PROGRESS BAR');
      this.isHidden = false;
    }
  }

  hide() {
    if (this.progressBar && !this.isHidden) {
      console.log('HIDDEN PROGRESS BAR');
      this.isHidden = true;
    }
  }
}
