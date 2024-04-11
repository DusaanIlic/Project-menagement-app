import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';
import { taskActivity } from '../models/taskActivity';
import { taskPriority } from '../models/taskPriority';

const TASK_API = 'http://localhost:8000/api/Task';
const TASKACTIVITY_API = 'http://localhost:8000/api/TaskActivity';
const TASKPRIOROTY_API = 'http://localhost:8000/api/TaskPriority';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasksByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${TASK_API}/project/${projectId}`);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${TASK_API}/${id}`);
  }

  saveTask(taskData: any): Observable<any>{
    return this.http.post<any>(`${TASK_API}`, taskData);
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
