import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { AddCategoryComponent } from './features/categories/add-category/add-category.component';

const routes: Routes = [
  {
    path: 'admin/categories',
    component: CategoryListComponent
  },

  {
    path: "admin/categories/add",
    component: AddCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
