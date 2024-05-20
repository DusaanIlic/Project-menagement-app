import {Injectable} from "@angular/core";
import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {BehaviorSubject, Observable, skipWhile} from "rxjs";
import {environment} from "../../environments/environment";
import {Notification} from "../models/notification";
import {PermissionService} from "./permission.service";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private connectedMembersSubject: BehaviorSubject<Set<number>>;
  private notificationSubject: BehaviorSubject<Notification | null> = new BehaviorSubject<Notification | null>(null);

  constructor(private permissionService: PermissionService) {
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

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.notificationSubject.next(notification);
    });

    this.hubConnection.on('AddAssignedProject', (id: number) => {
      this.permissionService.addProjectId(id);
    });

    this.hubConnection.on('RemoveAssignedProject', (id: number) => {
      this.permissionService.removeProjectId(id);
    });
  }

  public startConnection() {
    if (this.hubConnection.state == HubConnectionState.Connected) {
      return;
    }

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

  public getNotification(): Observable<Notification | null> {
    return this.notificationSubject.pipe(
      skipWhile(notification => notification === null)
    );
  }
}
