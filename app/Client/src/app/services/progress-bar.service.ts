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
    if (this.progressBar && this.isHidden) {
      setTimeout(() => {
        this.isHidden = false;
      }, 0);
    }
  }

  hide() {
    if (this.progressBar && !this.isHidden) {
      setTimeout(() => {
        this.isHidden = true;
      }, 0);
    }
  }
}
