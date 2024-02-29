import { Injectable } from '@angular/core';
import { Pet } from '../models/pet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private url = "pets";

  constructor(private http: HttpClient) { }

  public getPets () : Observable<Pet[]> {
    return this.http.get<Pet[]>(`${environments.apiUrl}/${this.url}`)
  }

  public getPet (id: number) : Observable<Pet> {
    return this.http.get<Pet>(`${environments.apiUrl}/${this.url}/${id}`)
  }

  public updatePet (pet: Pet) : Observable<Pet[]> {
    return this.http.put<Pet[]>(`${environments.apiUrl}/${this.url}/${pet.id}`, pet)
  }

  public createPet (pet: Pet) : Observable<Pet[]> {
    return this.http.post<Pet[]>(`${environments.apiUrl}/${this.url}`, pet)
  }

  public deletePet (pet: Pet) : Observable<Pet[]> {
    return this.http.delete<Pet[]>(`${environments.apiUrl}/${this.url}/${pet.id}`)
  }
}
