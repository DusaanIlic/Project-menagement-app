import { Injectable } from '@angular/core';
import { Igrac } from '../models/igrac';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IgracService {
  private url = "Igrac";
  constructor(private http: HttpClient) { }

  public getIgraci() : Observable<Igrac[]> {
    return this.http.get<Igrac[]>(`${environment.apiUrl}/${this.url}`);
  }

  public updateIgrac(igrac: Igrac) : Observable<Igrac[]> {
    return this.http.put<Igrac[]>(`${environment.apiUrl}/${this.url}`, igrac);
  }

  public createIgrac(igrac: Igrac) : Observable<Igrac[]> {
    return this.http.post<Igrac[]>(`${environment.apiUrl}/${this.url}`, igrac);
  }

  public deleteIgrac(igrac: Igrac) : Observable<Igrac[]> {
    return this.http.delete<Igrac[]>(`${environment.apiUrl}/${this.url}/${igrac.id}`);
  }
}
