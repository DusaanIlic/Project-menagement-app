import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {MemberListComponent} from "./member-list/member-list.component";
import {MemberDetailsComponent} from "./member-details/member-details.component";
import {MemberAddComponent} from "./member-add/member-add.component";
import {MemberUpdateComponent} from "./member-update/member-update.component";

const routes: Routes = [
  { path: '', redirectTo: '/members', pathMatch: 'full' },
  { path: 'members', component: MemberListComponent },
  { path: 'members/:id', component: MemberDetailsComponent },
  { path: 'add', component: MemberAddComponent },
  { path: 'update/:id', component: MemberUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
