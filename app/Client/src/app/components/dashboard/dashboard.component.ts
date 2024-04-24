import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {RouterLink} from "@angular/router";
import {Project} from "../../models/project";
import {ProjectServiceGet} from "../../services/project.service";
import {AuthService} from "../../services/auth.service";
import {data} from "autoprefixer";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderRow,
    MatHeaderRowDef,
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    MatHeaderCellDef,
    MatMenuTrigger,
    RouterLink,
    MatSort,
    MatRow,
    MatRowDef,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatPaginator
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  projects!: Project[];
  memberId!: any;
  projectSource: any;
  projectColumns: string[] = ['project', 'deadline', 'priority', 'actions'];

  @ViewChild(MatSort) projectSort: any;
  @ViewChild(MatPaginator) projectPaginator: any;


  constructor(private authService: AuthService, private _liveAnnouncer: LiveAnnouncer,
                private projectService: ProjectServiceGet) { }

  ngOnInit(): void {
    this.memberId = this.authService.getAuthenticatedMembersId();

    this.projectService.getAllProjectsWhereMemberIsAssigned(this.memberId).subscribe({
      next: data=> {
        this.projects = data;
        this.projectSource = new MatTableDataSource(this.projects);
        this.projectSource.sort = this.projectSort;
        this.projectSource.paginator = this.projectPaginator;
      },
      error: error => {
        console.log('failed fetching project data');
      }
    });
  }

  protected readonly data = data;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
