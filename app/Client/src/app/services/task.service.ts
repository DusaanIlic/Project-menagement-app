import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';
import { taskActivity } from '../models/taskActivity';
import { taskPriority } from '../models/taskPriority';
import { environment} from "../../environments/environment";

const TASK_API = `${environment.apiUrl}/Task`;
const PROJECT_API = `${environment.apiUrl}/Project`;
const TASKACTIVITY_API = `${environment.apiUrl}/TaskActivity`;
const TASKPRIOROTY_API = `${environment.apiUrl}/TaskPriority`;
const TASKCATEGORY_API = `${environment.apiUrl}/TaskCategory`;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${TASK_API}/project/${projectId}`);
  }

  getTaskStatusesByProject(projectId: number): Observable<any[]>{
    return this.http.get<any[]>(`${PROJECT_API}/${projectId}/TaskStatus`);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${TASK_API}/${id}`);
  }

  saveTask(taskData: any): Observable<any>{
    return this.http.post<any>(`${TASK_API}`, taskData);
  }

  getAllTaskCategories(): Observable<any[]> {
    return this.http.get<any[]>(TASKCATEGORY_API);
  }

  updateTaskStatus(taskId: number, statusId: number): Observable<any> {
    return this.http.put<any>(`${TASK_API}/${taskId}/status/${statusId}`, httpOptions);
  }

  addTaskStatus(projectId: number, taskStatusName: string): Observable<any> {
    const addTaskStatusRequest = { name: taskStatusName };
    return this.http.post<any>(`${PROJECT_API}/${projectId}/TaskStatus`, addTaskStatusRequest);
  }

  getProjectMembers(projectId: number): Observable<any>{
    return this.http.get<any>(`${PROJECT_API}/${projectId}/members`);
  }

  getTasksByMember(memberId : number): Observable<Task[]>
  {
    return this.http.get<Task[]>(`${TASK_API}/members/${memberId}/tasks`);
  }

  getTaskActivities(): Observable<taskActivity[]>
  {
    return this.http.get<taskActivity[]>(`${TASKACTIVITY_API}`);
  }

  getTaskPriority(taskId : number) : Observable<taskPriority>
  {
    return this.http.get<taskPriority>(`${TASKPRIOROTY_API}/${taskId}`);
  }

  saveTaskActivity(taskAct : any) : Observable<any>
  {
    return this.http.post<any>(`${TASKACTIVITY_API}`, taskAct);
  }

  getTaskActivityName(taskActivityId : number) : Observable<any>
  {
    return this.http.get<any>(`${TASKACTIVITY_API}Type/${taskActivityId}`);
  }

  getTaskActivityType() : Observable<any>
  {
    return this.http.get<any>(`${TASKACTIVITY_API}Type`);
  }

  changeTaskDescription(task : any, taskId: number) : Observable<any>
  {
    return this.http.put<any>(`${TASK_API}/${taskId}`, task);
  }

  deleteTaskActivity(taskActivityId : number) : Observable<any>
  {
    return this.http.delete(`${TASKACTIVITY_API}/${taskActivityId}`);
  }

  getTaskById(taskId : number) : Observable<any[]>
  {
    return this.http.get<any[]>(`${TASK_API}/${taskId}`);
  }

  assignMembersToTask(taskId : number, membersId : number[]) : Observable<any[]>
  {
    return this.http.put<any[]>(`${TASK_API}/${taskId}/assign`, membersId);
  }

  removeMemberFromTask(taskId : number, membersId : number) : Observable<any[]>
  {
    return this.http.delete<any[]>(`${TASK_API}/${taskId}/remove/${membersId}`);
  }

  getTasksDependentOnTaskId(taskId : number) : Observable<any[]>
  {
    return this.http.get<any[]>(`${TASK_API}/${taskId}/DependentTasks`);
  }

}
