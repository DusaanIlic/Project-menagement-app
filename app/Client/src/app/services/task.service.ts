import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const TASK_API = 'http://localhost:8000/api/Task';

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

  updateTaskStatus(taskId: number, statusId: number, column: string): Observable<any> {
    const taskData = { taskStatusId: statusId }; 

    return this.http.post<any>(`${TASK_API}/${taskId}/status/${statusId}`, taskData);
}

}