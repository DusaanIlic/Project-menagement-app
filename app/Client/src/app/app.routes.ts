import {RouterConfigOptions, RouterModule, Routes} from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AllMembersComponent } from "./components/all-members/all-members.component";
import { AllProjectsComponent } from "./components/all-projects/all-projects.component";
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AllRolesComponent } from "./components/all-roles/all-roles.component";
import { EditMemberComponent } from './components/edit-member/edit-member.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ProjectOverviewComponent} from "./components/project-overview/project-overview.component";
import {AllTasksComponent} from "./components/all-tasks/all-tasks.component";
import { KanbanComponent } from './components/kanban/kanban.component';
import { MemberOverviewComponent } from './components/member-overview/member-overview.component';
import {AllAssigneesComponent} from "./components/all-assignees/all-assignees.component";
import {ProjectComponent} from "./components/project/project.component";

export const routerConfig: RouterConfigOptions = {
  paramsInheritanceStrategy: 'always'
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'members/all', component: AllMembersComponent, canActivate: [AuthGuard] },
  { path: 'members/:id/edit', component: EditMemberComponent, canActivate: [AuthGuard]}, //Umeso 1 treba da bude ID membera koji se edituje
  { path: 'projects/all', component: AllProjectsComponent, canActivate: [AuthGuard] },
  { path: 'projects/add', component: AddProjectComponent, canActivate: [AuthGuard]  },
  { path: 'roles/all', component: AllRolesComponent, canActivate: [AuthGuard] },
  { path: 'roles/:id/edit', component: EditRoleComponent, canActivate: [AuthGuard] },
  { path: 'members/:id', component: MemberOverviewComponent, canActivate: [AuthGuard] },
  {
    path: 'projects/:id', // The part causing me a headache
    component: ProjectComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'kanban', component: KanbanComponent, canActivate: [AuthGuard] },
      { path: 'assignees', component: AllAssigneesComponent, canActivate: [AuthGuard] },
      { path: 'tasks', component: AllTasksComponent, canActivate: [AuthGuard] },
    ]
  }
]
