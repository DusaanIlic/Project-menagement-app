import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

const PROJECT_API = 'http://localhost:8000/api/Project';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token', // ovde ce da ide token za autorizaciju kada ona bude omogucena na bekendu
  }),
};

@Injectable({
providedIn: 'root'
})
export class ProjectServiceGet{
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${PROJECT_API}`);
  }

  deleteProjectById(id? : number): Observable<any[]>
  {
    return this.http.delete<any>(`${PROJECT_API}/${id}`);
  }

}


