import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'], // Corrected from styleUrl to styleUrls
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo; // Assuming Todo is an interface you've defined elsewhere

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Assuming getTodoById is a method that returns an Observable<Todo> for a single todo item
    this.todoService.getTodoById(this.todo.id).subscribe((todo) => {
      this.todo = todo;
    });
  }

  // Example method to update a single todo item
  updateTodoItem(todo: Todo) {
    this.todoService.updateTodo(todo).subscribe((updatedTodo) => {
      this.todo = updatedTodo; // Update the todo item in the component after the update
    });
  }
}
