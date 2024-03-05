import { Component } from '@angular/core';
import { AddProjectComponentComponent } from "../add-project-component/add-project-component.component";

@Component({
    selector: 'app-all-projects-component',
    standalone: true,
    templateUrl: './all-projects-component.component.html',
    styleUrl: './all-projects-component.component.scss',
    imports: [AddProjectComponentComponent]
})
export class AllProjectsComponentComponent {

}
