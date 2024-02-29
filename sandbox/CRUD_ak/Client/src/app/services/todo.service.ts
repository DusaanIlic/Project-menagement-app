import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://localhost:7144/api';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/todo-items`);
  }

  createTodo(todoText: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/todo-items`, {
      text: todoText,
    });
  }

  getTodoById(todo: Todo): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/todo-items/${todo.id}`);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/todo-items/${todo.id}`, todo);
  }

  deleteTodo(todo: Todo): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todo-items/${todo.id}`);
  }
}
