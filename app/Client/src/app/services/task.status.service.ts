import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const TASK_API = 'http://localhost:8000/api/ProjectTaskStatus';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService{
    constructor(private http: HttpClient) { }

    saveTaskStatus(taskStatus: any): Observable<any> {
        return this.http.post<any>(TASK_API, taskStatus, httpOptions);
    }

}

