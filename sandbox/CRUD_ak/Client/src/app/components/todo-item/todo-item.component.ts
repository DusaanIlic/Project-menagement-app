import { Component, Input, OnInit } from "@angular/core";
import { Todo } from "../../models/todo";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-todo-item",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./todo-item.component.html",
  styleUrl: "./todo-item.component.css",
})
export class TodoItemComponent {
  @Input() todo!: Todo;
}
