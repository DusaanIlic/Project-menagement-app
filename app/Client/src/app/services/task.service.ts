import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';
import { taskActivity } from '../models/taskActivity';

const TASK_API = 'http://localhost:8000/api/Task';
const TASKACTIVITY_API = 'http://localhost:8000/api/TaskActivity';

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

  getTasksByMember(memberId : number): Observable<any[]>
  {
    return this.http.get<any[]>(`${TASK_API}/members/${memberId}/tasks`);
  }

  getTaskActivities(): Observable<taskActivity[]>
  {
    return this.http.get<taskActivity[]>(`${TASKACTIVITY_API}`);
  }

}