import { Injectable } from "@angular/core";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {BehaviorSubject, Observable} from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private connectedMembersSubject: BehaviorSubject<Set<number>>;

  constructor() {
    this.connectedMembersSubject = new BehaviorSubject<Set<number>>(new Set<number>());
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
      const connectedMembers = this.connectedMembersSubject.getValue();
      connectedMembers.add(memberId);
      this.connectedMembersSubject.next(connectedMembers);
    });

    this.hubConnection.on('MemberDisconnected', (memberId: number) => {
      const connectedMembers = this.connectedMembersSubject.getValue();
      connectedMembers.delete(memberId);
      this.connectedMembersSubject.next(connectedMembers);
    });

    this.hubConnection.on('ConnectedMembers', (memberIds: number[]) => {
      this.connectedMembersSubject.next(new Set(memberIds));
    });
  }

  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection'));
  }

  public stopConnection() {
    this.hubConnection
      .stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(err => console.log('Error while stopping SignalR connection'));
  }

  // Method to get connected member IDs as an Observable
  public getConnectedMemberIds(): Observable<Set<number>> {
    return this.connectedMembersSubject.asObservable();
  }
}
