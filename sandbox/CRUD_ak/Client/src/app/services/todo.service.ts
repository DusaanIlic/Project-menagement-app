import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Todo } from "../models/todo";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(private http: HttpClient) {}

  private apiUrl = "http://localhost:5034/api";

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/todos`);
  }

  createTodo(todoText: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/todos`, {
      text: todoText,
    });
  }

  getTodoById(todo: Todo): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/todos/${todo.id}`);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/todos/${todo.id}`, todo);
  }

  deleteTodo(todo: Todo): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${todo.id}`);
  }
}
