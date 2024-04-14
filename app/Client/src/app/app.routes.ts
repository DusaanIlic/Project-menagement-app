import { RouterConfigOptions, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AllMembersComponent } from './components/all-members/all-members.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { MemberOverviewComponent } from './components/member-overview/member-overview.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { EditMemberComponent } from './components/edit-member/edit-member.component';
import { AllRolesComponent } from './components/all-roles/all-roles.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { ProjectComponent } from './components/project/project.component';
import { AllAssigneesComponent } from './components/all-assignees/all-assignees.component';
import { AllTasksComponent } from './components/all-tasks/all-tasks.component';
import { ProjectKanbanComponent } from './components/project-kanban/project-kanban.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GanttComponent } from './components/gantt/gantt.component';

export const routerConfig: RouterConfigOptions = {
  paramsInheritanceStrategy: 'always',
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot/:token', component: ForgotPasswordComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'members/all',
    component: AllMembersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'members/:id/edit',
    component: EditMemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/all',
    component: AllProjectsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'roles/all', component: AllRolesComponent, canActivate: [AuthGuard] },
  {
    path: 'roles/:id/edit',
    component: EditRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'members/:id',
    component: MemberOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'kanban',
        component: ProjectKanbanComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'assignees',
        component: AllAssigneesComponent,
        canActivate: [AuthGuard],
      },
      { path: 'tasks', component: AllTasksComponent, canActivate: [AuthGuard] },
      { path: 'gantt', component: GanttComponent, canActivate: [AuthGuard] },
    ],
  },
];
