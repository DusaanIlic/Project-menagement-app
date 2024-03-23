import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from "./components/add-member/add-member.component";
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
import { MemberOverviewComponent } from './components/member-overview/member-overview.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "members/add", component: AddMemberComponent, canActivate: [AuthGuard] },
  { path: "members/all", component: AllMembersComponent, canActivate: [AuthGuard] },
  { path: "members/edit/:id", component: EditMemberComponent, canActivate: [AuthGuard]}, //Umeso 1 treba da bude ID membera koji se edituje
  { path: "projects/all", component: AllProjectsComponent, canActivate: [AuthGuard] },
  { path: "projects/add", component: AddProjectComponent, canActivate: [AuthGuard]  },
  { path: "projects/:id", component: ProjectOverviewComponent, canActivate: [AuthGuard] },
  { path: "roles/all", component: AllRolesComponent, canActivate: [AuthGuard] },
  { path: 'roles/edit/:id', component: EditRoleComponent, canActivate: [AuthGuard] },
  { path: 'members/:id', component: MemberOverviewComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes {}
