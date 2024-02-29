import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../features/categories/services/data.service';
import { Subscription } from 'rxjs';
import { AddCategoryRequest } from '../../../features/categories/models/add-category-request-model';
import { CategoryService } from '../../../features/categories/services/category.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {
  dataList: any[] = [];
  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription
  constructor(private dataService: DataService, private categorySevice: CategoryService)
  {
    this.model =
    {
      title: '',
      author: '',
      description: '',
      content: ''
      }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getData().subscribe(data => {
      this.dataList = data;
    });
  }

  deleteBlog(item: any): void {
    console.log(item)
  }
  onFormSubmit() {
    console.log("succes")
  }

  updateBlog(item: any): void {
    console.log(item)
  }
}

