import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import * as SignalR from '@microsoft/signalr';

export interface SignalRConnection {
  url: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  private hubConnection!: SignalR.HubConnection;
  message: Subject<string> = new Subject();

  constructor(private http: HttpClient) {
  }

  private getSignalRConnection(id: any): Observable<SignalRConnection> {
    const slug = `${environment.signalR}/api/SignalR${id ? '/'+id : ''}`;
    return this.http.get<SignalRConnection>(slug);
  }

  init(id = null) {
    this.getSignalRConnection(id).subscribe(con => {
      const options = {
        accessTokenFactory: () => con.accessToken
      };

      this.hubConnection = new SignalR.HubConnectionBuilder()
        .withUrl(con.url, options)
        .configureLogging(SignalR.LogLevel.Information)
        .build();

      this.hubConnection.on('notify', data => {
        this.message.next(data);
      });

      this.hubConnection.start()
        .catch(error => console.error(error));

      this.hubConnection.serverTimeoutInMilliseconds = 3600000;
      this.hubConnection.keepAliveIntervalInMilliseconds = 3600000;

      this.hubConnection.onclose((error) => {
        // this.hubConnection.start();
        console.error(`Something went wrong: ${error}`);
      });
    });
  }
  close() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
