import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

}