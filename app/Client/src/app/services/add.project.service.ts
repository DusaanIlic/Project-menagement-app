import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectAddRequest } from '../models/project-add';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
    Authorization: 'my-auth-token', // ovde ce da ide token za autorizaciju kada ona bude omogucena na bekendu
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(project: ProjectAddRequest): Observable<ProjectAddRequest> {
    return this.http.post<ProjectAddRequest>(
      `${environment.apiUrl}/api/Project`,
      project,
      httpOptions
    );
  }
}
