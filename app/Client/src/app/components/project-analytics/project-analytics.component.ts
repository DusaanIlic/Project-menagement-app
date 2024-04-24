import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, switchMap} from "rxjs";
import {ProjectServiceGet} from "../../services/project.service";
import {MemberService} from "../../services/member.service";
import {TaskService} from "../../services/task.service";
import { Task } from '../../models/task';
import {LegendPosition, LineChartModule, NgxChartsModule} from "@swimlane/ngx-charts";
import {Member} from "../../models/member";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [
    LineChartModule,
    NgxChartsModule,
    MatCard
  ],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss'
})
export class ProjectAnalyticsComponent implements OnInit{

  taskCategories : any[] = [];
  customColors: any;
  below = LegendPosition.Below
  projectId : number = 0;
  tasks : any;
  dataForChart : any;
  allTasksCount : number = 0;
  finishedTasksCount : number = 0;
  namesForBarChart : any;
  dataForBarChart : any;


  constructor(private route: ActivatedRoute,
              private pService : ProjectServiceGet,
              private mService : MemberService,
              private tService : TaskService) {}


  ngOnInit(): void
  {
     this.route.params.pipe(
      switchMap((params, index) =>{
        //console.log(params['id']);
        this.projectId = params['id'];

        return this.tService.getTasksByProject(this.projectId)



      })
    ).subscribe((tasks : Task[]) =>{
      //console.log(tasks)
      this.tasks = tasks
      for(let i = 0; i < tasks.length; i++)
      {
        this.allTasksCount++;
        if(tasks[i].taskStatus === 'Completed')
          this.finishedTasksCount++;

      }
      //console.log(this.finishedTasksCount)

      this.dataForChart = [{name: "Finished", value: (this.finishedTasksCount / this.allTasksCount) * 100}];
      this.customColors = [{name: "Finished", value: "#3F51B5"}]
     })

    this.tService.getTaskCategoriesOnProject(this.projectId).subscribe(data =>{
      this.taskCategories = data

      //console.log(data)
      this.namesForBarChart = data.map((value : any) => {return {name: value.categoryName, value : 0}});
      //console.log(this.namesForBarChart);

      for(let i=0;i<this.allTasksCount;i++)
      {
        for(let j=0;j<this.namesForBarChart.length;j++)
        {
          if(this.tasks[i].taskCategoryName === this.namesForBarChart[j].name && this.tasks[i].taskStatus != 'Completed')
          {
            this.namesForBarChart[j].value++;
          }
        }
      }

      console.log(this.namesForBarChart)
    })



  }
}
