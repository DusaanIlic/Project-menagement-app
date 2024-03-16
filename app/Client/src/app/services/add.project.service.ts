import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token', // ovde ce da ide token za autorizaciju kada ona bude omogucena na bekendu
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(
      `${environment.apiUrl}/projects`,
      project,
      httpOptions
    );
  }
}
