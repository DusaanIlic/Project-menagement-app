import { Component } from '@angular/core';
import { ProjectComponent } from "../../models/project/project.component";

@Component({
    selector: 'app-all-projects-component',
    standalone: true,
    templateUrl: './all-projects-component.component.html',
    styleUrl: './all-projects-component.component.scss',
    imports: [ProjectComponent]
})
export class AllProjectsComponentComponent {

}
