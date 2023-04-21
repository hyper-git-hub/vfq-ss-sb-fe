import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { TableConfig } from 'src/app/shared/general-table/model';
// import { PackageType } from 'src/app/core/enum/packages-enum';
// import { DrawerService } from 'src/app/core/services/drawer.service';

// import { ConfigService } from 'src/app/Services/config.service';
import { environment, ports } from 'src/environments/environment';
import { NotificationsTableConfig } from './config';

// import { AppLoader } from '../data/model/app-loader';
// import { HeaderService } from '../shared/services/header.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  go: boolean = false;
  maxDate = new Date();
  dropdownOptions: any[] = [];
  selectedOption: any = [];
  selectedDate: any = [];
  // appLoader = new AppLoader();
  sidebarCheck;

  config: TableConfig;
  totalLength = 0;

  loggedInUser;
  notificationsList: any[];
  breadCrumbs = [];
  showIndeterminateProgress: boolean;
  displayedColumns = ['title', 'body', 'duration'];
  packageType;
  port = ports;
  user;
  count: any;
  alert_count;
  configuration;

  filters = { limit: 10, offset: '0', order_by: '', order: '', search: '' };
  actions: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.user = this.authService.getUser();
    this.config = new TableConfig(NotificationsTableConfig.config);
    this.notificationsList = [];
    this.breadCrumbs = [
      {
        name: 'Notification',
        url: '',
        icon: '',
      },
    ];
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    this.getNotifications(this.filters);
  }

  getNotifications(filters: any) {
    this.actions.next({ action: 'loadingTrue' });
    this.showIndeterminateProgress = true;
    let url = new URL(`${environment.baseUrlNotif}/notifications/`);
    for (let key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.actions.next({ action: 'loadingFalse' });
      this.notificationsList = resp.data['data'];
      this.count = resp.data.count;
    }, (err: any) => {
      this.actions.next({ action: 'loadingFalse' });
      this.toastr.error(err.error['message']);
    });
  }

  clearNotifications() {
    // this.headerService.clearNotificationsHistory(this.port.monolith).subscribe(response => {
    this.totalLength = 0;
    // this.notifications_list = response['data'].data;
  }

  onTableSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'onSorting') {
      this.filters.order = ev.data['direction'];
      this.filters.order_by = ev.data['column'];
      this.getNotifications(this.filters);
    } else if (ev.type === 'onPagination') {
      this.filters.limit = ev.data['limit'];
      this.filters.offset = ev.data['offset'];
      this.getNotifications(this.filters);
    }
  }

  getAllnot() {
    let url = new URL(`${environment.baseUrlNotif}/notifications/`);
    this.apiService.get(url.href).subscribe((resp: any) => {
      console.log(' the res', resp);
    });
  }
}
