import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {PermissionService} from "../../services/permission.service";
import {SignalRService} from "../../services/signal-r.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private permissionService: PermissionService, private signalRService: SignalRService) {
  }

  ngOnInit(): void {
      this.signalRService.startConnection();
      this.permissionService.refreshData();
  }
}
