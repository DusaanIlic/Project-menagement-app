import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AllProjectsComponentComponent } from "./components/all-projects-component/all-projects-component.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AllProjectsComponentComponent]
})
export class AppComponent {
  title = 'Client';
}
