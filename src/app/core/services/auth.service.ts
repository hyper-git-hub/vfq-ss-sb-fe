// Created by soban on 09-08-2017.
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { iolModules } from "../model/module";
import { StorageService } from 'src/app/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = this.getUser();
  private dataSource = new BehaviorSubject(this.user);
  logged_in_user = this.dataSource.asObservable();

  constructor(private route: Router, public localStorageService: StorageService,
    private http: HttpClient) {
  }

  login(contact_number: string, password: string) {

    return this.http.post<any>('user/login/',
      {
        username: contact_number,
        password: password
      }).pipe(map(user => {
        if (!user['error']) {
          localStorage.setItem('user', JSON.stringify(user['data'][0]));
          this.dataSource.next(user['data'][0]);
        }
        else {
          console.error(user['message']);
        }
        return user;
      }
      ));
  }

  getToken() {
    var token = null;
    var user = JSON.parse(localStorage.getItem('user'));

    if (user != null)
      token = user['token'];

    return token;
  }




  setUser(user: any): void {
    if (!!user)
      this.localStorageService.store('user', user);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    if (localStorage.getItem('token') != 'undefined' && localStorage.getItem('token') != null) {
      return true;
    }
  }

  unsetUser(): void {
    this.localStorageService.clear('user');
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      const user: any = JSON.parse(localStorage.getItem('user'));
      if (user && !!(localStorage.getItem("token"))) {
        return true;
      }
    }
    return false;
  }

  updatedDataSelection(data) {
    this.dataSource.next(data);
  }

  returnUser() {
    return this.logged_in_user;
  }

  isCaretaker() {
    const caretaker_id = [4, 5];
    const user: User = this.getUser();
    if (caretaker_id.indexOf(user.user_role_id) !== -1) {
      return true;
    }
    return false;
  }

  hasTruckPreferredModule() {
    return (this.getUser().preferred_module === iolModules.trucks);
  }
}
