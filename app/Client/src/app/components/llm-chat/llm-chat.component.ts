import { Component } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelActionRow, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatHeaderCell} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-llm-chat',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatInput,
    MatExpansionPanelActionRow,
    MatLabel,
    MatExpansionPanelDescription,
    MatDivider
  ],
  templateUrl: './llm-chat.component.html',
  styleUrl: './llm-chat.component.scss'
})
export class LlmChatComponent {

}
