import { Component, OnInit } from "@angular/core";
import { Todo } from "../../models/todo";
import { TodoService } from "../../services/todo.service";
import { TodoItemComponent } from "../todo-item/todo-item.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoText = "";

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  createTodo(): void {
    this.todoService.createTodo(this.newTodoText).subscribe(() => {
      this.newTodoText = "";
      this.loadTodos();
    });
  }

  toggleTodoComplete(todo: Todo): void {
    todo.complete = !todo.complete;
    this.todoService.updateTodo(todo).subscribe(() => {
      this.loadTodos();
    });
  }

  deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo).subscribe(() => {
      this.loadTodos();
    });
  }
}
