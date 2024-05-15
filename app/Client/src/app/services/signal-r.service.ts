import { Injectable } from "@angular/core";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private connectedMembers: Set<number>;

  constructor() {
    this.connectedMembers = new Set<number>();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/SignalR`, {
        withCredentials: localStorage.getItem('jwt-token') != null,
        accessTokenFactory: () => {
          const token = localStorage.getItem('jwt-token');
          return token ? token : "";
        },
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)  // Use Debug level for more detailed logging
      .build();

    this.registerServerEvents();
  }

  private registerServerEvents() {
    this.hubConnection.on('MemberConnected', (memberId: number) => {
      console.log('Member connected: ', memberId);
      this.connectedMembers.add(memberId);
      console.log('Current connected members: ', Array.from(this.connectedMembers));
    });

    this.hubConnection.on('MemberDisconnected', (memberId: number) => {
      console.log('Member disconnected: ', memberId);
      this.connectedMembers.delete(memberId);
      console.log('Current connected members: ', Array.from(this.connectedMembers));
    });

    this.hubConnection.on('ConnectedMembers', (memberIds: number[]) => {
      console.log('Initial connected members: ', memberIds);
      this.connectedMembers = new Set(memberIds);
      console.log('Current connected members: ', Array.from(this.connectedMembers));
    });
  }

  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ', err));
  }

  public stopConnection() {
    this.hubConnection
      .stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(err => console.log('Error while stopping SignalR connection: ', err));
  }
}
