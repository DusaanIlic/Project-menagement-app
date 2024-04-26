import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {concatMap, count, from, map, mergeMap, Observable, switchMap} from "rxjs";
import {ProjectServiceGet} from "../../services/project.service";
import {MemberService} from "../../services/member.service";
import {TaskService} from "../../services/task.service";
import { Task } from '../../models/task';
import {LegendPosition, LineChartModule, NgxChartsModule} from "@swimlane/ngx-charts";
import {Member} from "../../models/member";
import {MatCard} from "@angular/material/card";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,

} from "@angular/material/expansion";
import {MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [
    LineChartModule,
    NgxChartsModule,
    MatCard,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatSidenavContainer,
    MatSidenavModule,
    MatIcon
  ],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss'
})
export class ProjectAnalyticsComponent implements OnInit{

  tasksPerMember : any;
  membersOnProject : any;
  taskCategories : any[] = [];
  customColors: any;
  projectId : number = 0;
  tasks : any;
  dataForChart : any;
  allTasksCount : number = 0;
  finishedTasksCount : number = 0;
  namesForBarChart : any;
  array : any[] = [];


  constructor(private route: ActivatedRoute,
              private pService : ProjectServiceGet,
              private mService : MemberService,
              private tService : TaskService) {}


  ngOnInit(): void
  {
     this.route.params.pipe(
      concatMap((params, index) =>{
        //console.log(params['id']);
        this.projectId = params['id'];

        return this.tService.getTasksByProject(this.projectId);
      }),

       concatMap((tasks : Task[]) =>{

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

           return this.tService.getTaskCategoriesOnProject(this.projectId);
       }),

       concatMap((data : any[]) =>{
            //console.log(tasks)
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

            //console.log(this.namesForBarChart)

         return this.pService.getMembersByProjectId(this.projectId);
       }),

       concatMap((members : Member[]) =>{
         this.membersOnProject = members;

         return from(members).pipe(
           mergeMap(member =>{
             return this.tService.getTasksByMember(member.id).pipe(
               map(tasks =>({
                 name: member.firstName + " " + member.lastName,
                 id: member.id,
                 value: tasks.length
               }))
             )
           })
         )
       })

    ).subscribe((data : {name : string, id:number, value : number}) =>{
      if(data.value == undefined)
        data.value = 0;
      this.array.push(data);
       this.tasksPerMember = this.array.map((value : any) => {return {name: value.name, value : value.value, extra : {id : value.id}}});
       console.log(this.tasksPerMember)
     })





  }//ONINIT END




  onSelect(event : any)
  {
    console.log(event.extra.id)
  }

  openMemberOverview(id : number)
  {

  }

}
