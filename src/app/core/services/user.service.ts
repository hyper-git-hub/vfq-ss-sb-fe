import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { ApiResponse, LoginApiResponse } from '../model/api.response';
import { User } from '../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { apiIdentifier, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) {
  }
  user: User;
  fleet: any;
  territory: any;
  client: any;

  setSelectedUser(data) {
    this.user = data;
  }
  getSelectedUser() {
    return this.user;
  }
  destorySelectedUser() {
    return null;
  }

  setSelectedFleet(data) {
    this.fleet = data;
  }
  getSelectedFleet() {
    return this.fleet;
  }

  setSelectedTerritory(data) {
    this.territory = data;
  }
  getSelectedTerritory() {
    return this.territory;
  }

  setSelectedClient(data) {
    this.client = data;
  }
  getSelectedClient() {
    return this.client;
  }


  loginUser(user: User) {
    const url = `/api/users/login/`;
    return this.http.post(url, user);
  }

  login(user: User, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/login`;
    let a = this.http.post(url, user)
    return a;
  }

  sendEmailForForgetPassword(email, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/mfa`;
    return this.http.post(url, email);
  }

  verifyCode(code, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/mfa/verification`;
    return this.http.post(url, code);
  }

  getUserProfileDataSSO(userMs) {
    const url = `${userMs}/users/v3/user-profile?usecase=1&sso=true`;
    return this.http.get(url)
  }

  resetPassword(params, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/mfa/password`;
    return this.http.post(url, params);
  }

  resetPasswordFirstTime(params, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/authentication/password`;
    return this.http.post(url, params);
  }

  getUserProfileData(port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile`;
    return this.http.get(url)
  }

  updateUserPrfole(params, port = '') {
    let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.userMS}${port}/users/user-profile`;
    return this.http.patch(url, covertedData);
  }

  getConfigurationsData(port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/preferences`;
    return this.http.get(url)
  }
  

  saveUserPreferenceConfigurations(params, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/preferences`;
    return this.http.patch(url, params);
  }

  createNewPassword(val: any) {
    const url = `/api/users/change_password/`;
    return this.http.post(url, val);
  }

  modifyUserData(params) {
    const url = `/api/users/modify_user_details`;
    return this.http.patch(url, params);
  }

  modifyUserData2(params) {
    let dju = this.converToFormdata(params);
    const url = `/api/users/update_profile_new`;
    return this.http.patch(url, dju);
  }

  getcontract(params) {
    const url = `/iof/get_contracts_list?${params}`;
    return this.http.get(url);
  }

  postContract(params) {
    const url = '/iof/entity/'; //`${'/hypernet/entity/add_driver/'}`;
    return this.http.post(url, params);
  }


  converToFormdata(data) {
    var form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    return form_data;
  }

  //threshold


  getConfigurationsData1(port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/preferences`;
    return this.http.get(url)
  }

  saveUserThresholdConfigurations(params, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/preferences`;
    return this.http.patch(url, params);
  }

}
