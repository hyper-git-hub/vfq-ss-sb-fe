import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiIdentifier } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(public http: HttpClient) {

  }

  getAllCards(graphID, dashboardID, port = '') {
    const url = `${apiIdentifier.monolith}${port}/analytics/user-analytics-setting?type_id=${graphID}&dashboard_id=${dashboardID}`;
    let a = this.http.get(url)
    return a;
  }

  saveGraphData(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/analytics/user-analytics-setting`;
    let a = this.http.patch(url, params)
    return a;
  }

  getCardsByDasboardID(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/am/asset_group?${params}`;
    let a = this.http.get(url)
    return a;
  }

  saveCards(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/am/asset_type`;
    let a = this.http.post(url, params)
    return a;
  }

}