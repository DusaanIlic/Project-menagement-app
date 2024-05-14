import {Injectable} from "@angular/core";
import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor() {
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
      .configureLogging(LogLevel.Information)
      .build();

    this.registerServerEvents();
  }

  private registerServerEvents() {
    this.hubConnection.on('MemberConnected', (connectionId: string) => {
      console.log('Member connected: ', connectionId);
    });

    this.hubConnection.on('MemberDisconnected', (connectionId: string) => {
      console.log('Member disconnected: ', connectionId);
    });
  }

  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connectioned started'))
      .catch(err => console.log('Error while starting SignalR connection: ', err));
  }

  public stopConnection() {
    this.hubConnection
      .stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(err => console.log('Error while stopping SignalR connection: ', err));
  }
}
