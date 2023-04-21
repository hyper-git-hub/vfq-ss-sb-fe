import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';
import { Keepalive } from '@ng-idle/keepalive';
import { Subscription } from 'rxjs';

import { environment, ports } from 'src/environments/environment';
import { StorageService } from 'src/app/services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { NgbActiveModal, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
// import{ AngularFireDatabase } from '@angular/fire/database'
// import { AngularFireAuth } from '@angular/fire/auth';
import { ShareDataService } from './../../services/sharedData.service'
import { ApiService } from 'src/app/services/api.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild(NgbDropdownMenu) caseCodeDropdown: NgbDropdownMenu;
  toggleMenu: boolean;
  idleState = 'Not started.';
  user: any;
  userName = null;
  userSubscription$ = new Subscription;
  baseUrlHeader;
  @Output() signal: EventEmitter<any>;
  port = ports;
  fmsIsEnabled;
  ATIsEnabled;


  userEmail: any;
  userGuid: any;
  token;
  useremail: any;
  userIdentity: any;

  isAdmin = false;
  isManager = false;
  disablePreferences;
  target;
  timedOut = false;
  lastPing?: Date = null;

  configurationSettingsData: any = {
    is_notification_enabled: false,
    is_email_enabled: false,
    is_sms_enabled: false,
    auto_logout: 3,
    platform_notf_duration: 5,
    email_notf_duration: 5,
    sms_notf_duration: 5,
    page_size: 25
  }

  alert_count: any = 0;
  notifications_list: any[] = [];
  unRead: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private storageService: StorageService,
    private headerService: HeaderService,
    private dataTransferService: DataTransferService,
    private idle: Idle, private keepalive: Keepalive,
    private toastr: ToastrService,
    private fdb: AngularFireDatabase,
    // private fbauth: AngularFireAuth
  ) {
    this.toggleMenu = true;
    this.signal = new EventEmitter<any>();
    this.user = this.authService.getUser();
    this.useremail = localStorage.getItem('useremail');
    this.target = document.getElementById('caseCodeDropdown');
    console.log(this.target)
  }

  ngOnInit(): void {
    //// IDLE TIME FUNCTIONALITY STARTS ////
    this.dataTransferService.getConfigurationData().subscribe((res) => {
      if (res) {
        this.configurationSettingsData = res;

      }
      if (res == null && JSON.parse(localStorage.getItem("configurations"))) {
        this.configurationSettingsData = JSON.parse(localStorage.getItem("configurations"))
      }

      this.monitorUserIdling()
    });

    this.getNotifications();
    this.setUserInfo1();
    this.signal.emit(this.toggleMenu);

    // watch for changes in localStorage, change header properties accordingly for user
    this.userSubscription$ = this.storageService.changes.subscribe(res => {
      const loggedInUserService = this.storageService.getItem('user');

      if (loggedInUserService) {
        this.user = loggedInUserService;
        this.setUserInfo1();
      }
      if (!loggedInUserService) {
        window.location.reload()
      }
    });

    // Do your code here....
    setTimeout(() => {
      const user: any = localStorage.getItem('user');
      this.userIdentity = JSON.parse(user);
      // const customerId = JSON.stringify(this.userIdentity?.customer['customer_id']);
      // let email: string = this.userIdentity.email;
      // email = email.replace(/\./g, "-");

      this.fdb.object(`Notification/${this.userIdentity.guid}`).valueChanges().subscribe((item) => {
        if (!!item) {
          this.toastr.success('You have a new notification');
          this.updateAlertCount(item);
        }
      });
    }, 1000);
  }

  btnClick(ev?: any) {
    if (ev.isOpen()) {
      // this.getNotifications();
      this.patchNotifications();
    }
  }

  getNotifications() {
    const slug = `${environment.baseUrlNotif}/notifications/`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.notifications_list = resp.data['data'];
      if (this.notifications_list && this.notifications_list.length > 0) {
        this.unRead = this.notifications_list.filter((item: any) => {
          return item.is_viewed === false;
        });
        if (this.unRead) {
          this.alert_count = this.unRead.length;
          if (this.alert_count > 999) {
            this.alert_count = '999+';
          }
        }
      }
    });
  }

  patchNotifications() {
    const slug = `${environment.baseUrlNotif}/notifications/`;
    this.apiService.patch(slug,{}).subscribe((resp: any) => {
      // this.notifications_list = resp.data['data'];
      this.alert_count = 0;
      // if (this.notifications_list && this.notifications_list.length > 0) {
      //   this.unRead = this.notifications_list.filter((item: any) => {
      //     return item.is_viewed === false;
      //   });
      //   if (this.unRead) {
      //     this.alert_count = this.unRead.length;
      //     if (this.alert_count > 999) {
      //       this.alert_count = '999+';
      //     }
      //   }
      // }
    });
  }
  

  setZIndex() { }

  updateAlertCount(item: any) {
    if (this.unRead) {
      this.alert_count = this.unRead.length;
      if (this.alert_count > 999) {
        this.alert_count = '999+';
      } else {
        this.alert_count = this.alert_count + 1;
      }
      this.show(this.alert_count);
      if (this.alert_count === 0) {
        return;
      }
    }

    if (localStorage.getItem('user')) {
      this.getNotifications();
    }
  }

  show(item: any) {
    if (item === 0) {
      return;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.token = localStorage.getItem('token');
    }, 500);


  }

  monitorUserIdling() {
    // sets an idle timeout of 600 seconds, for testing purposes.
    this.idle.setIdle(15);
    // sets a timeout period of 600 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(this.configurationSettingsData?.auto_logout * 60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      // this.logout();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      // this.childModal.show();
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
    //// IDLE TIME FUNCTIONALITY END HERE ////
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  setUserInfo1() {



    this.user = this.authService.getUser();
    this.userName = !!this.user.username ? this.user.username : this.user.first_name;

    // Check if user has FMS usecase

    this.fmsIsEnabled = this.user?.customer?.associations.filter(item => {
      return item.package.usecase === 6
    })[0];


    this.ATIsEnabled = this.user?.customer?.associations.filter(item => {
      return item.package.usecase === 2
    })[0];



    // this.baseUrlHeader = environment.baseUrlUser + ports.userMS;

    // this.userGuid = this.user?.guid;
    // this.isAdmin = this.user?.user_role_id === UserRoleEnum.Admin;
    // this.isManager = this.user?.user_role_id === UserRoleEnum.Manager || this.user?.user_role_id === UserRoleEnum.FinanceManager;
    // this.disablePreferences = this.user?.preferred_module === hypernymModules.iop;
  }

  FMS() {
    let token = localStorage.getItem('token');
    // window.location.href = "https://fms.staging.iot.vodafone.com.qa/" + token;
    window.location.href = "http://localhost:4500/verify-token?token=" + token;
  }

  logout() {
    let userEmail = JSON.parse(localStorage.getItem('user') || '{}')
    let params = { 'email': userEmail.email }
    this.headerService.logOut(params, this.port.userMS).subscribe((data: any) => {
      this.authService.unsetUser();
      localStorage.removeItem("configurations")
      localStorage.removeItem("notificationCount")
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("token");
      localStorage.removeItem("features");

      let rememberMe = localStorage.getItem("remember");
      if (rememberMe != 'true') {
        localStorage.removeItem('useremail')
        localStorage.removeItem('userpassword')
      }

      //Firebase signout
      this.signOutFromFB();
      this.router.navigate(['/'])
    });
  }


  navigateToProfile() {
    this.router.navigateByUrl('/ss/user-admin/user-profile')
  }
  navigateToSetting() {
    this.router.navigateByUrl('/ss/user-admin/setting')
  }
  navigateToHelp() {
    this.router.navigateByUrl('/ss/user-admin/help')
  }
  navigateToNotification() {
    this.router.navigateByUrl('/ss/alerts/notification')
  }
  onToggleMenu() {
    this.toggleMenu = !this.toggleMenu;
    this.signal.emit(this.toggleMenu);
  }
  redirectToHome() {
    this.router.navigate(['/ss/dashboard/surveillance']);
  }

  refreshNotifications() {
    this.getNotifications();
  }

  navigate(ev: any) {
    ev.close();
    this.router.navigate(['/ss/alerts/notification']);
  }

  signOutFromFB() {
    // this.fbauth.signOut().then((res) => {
    //     // console.log(res);
    // });
  }

}
