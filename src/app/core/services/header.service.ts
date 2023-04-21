import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { AppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';
import { ApiResponse, LoginApiResponse } from 'src/app/core/model/api.response';
import { User } from 'src/app/core/model/user';
import { apiIdentifier } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(public http: HttpClient) {
  }
  // getSearch(key, params: any) {
  //   const url = `${AppConfig.APIOptionsHandler(key)}`;
  //   return this.http.get(url, { params: params });
  // }

  // getIoLNotificationCount(params?: any) {
  //   const url = `${AppConfig.URL}/hypernet/notifications/get_user_alerts_count`;
  //   return this.http.get(url, { params: params });
  // }

  resetNotifications(params?: any, port = '') {
    const url = `${apiIdentifier.monolith}${port}/assets/notification/customer?guid=${params}`;
    let a = this.http.patch(url, {guid: params})
    return a;
  }


  logOut(data, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/logout`;
    return this.http.post(url, data);
  }


  getNotifications(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/assets/notification/customer?guid=${params}`;
    let a = this.http.get(url)
    return a;
  }

  getNotificationsHistory(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/assets/notification/customer/all?limit=${params ? params : 10}`;
    let a = this.http.get(url, {params: params})
    return a;
  }

  clearNotificationsHistory(port = '') {
    const url = `${apiIdentifier.monolith}${port}/assets/notification/customer/all/clear`;
    let a = this.http.patch(url,'')
    return a;
  }
  getFeatures(port = '') {
    const url = `${apiIdentifier.monolith}${port}/assets/roles-and-access/user/features`;
    let a = this.http.get(url)
    return a;
  }

}
