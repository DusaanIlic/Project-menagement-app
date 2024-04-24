import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectAddRequest } from '../models/project-add';
import { HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment";

const ADD_P_API = `${environment.apiUrl}/Project`;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(project: ProjectAddRequest): Observable<ProjectAddRequest> {
    return this.http.post<ProjectAddRequest>(
      `${ADD_P_API}`,
      project,
      httpOptions
    );
  }
}
