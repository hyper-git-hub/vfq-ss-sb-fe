import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss']
})
export class CardSettingsComponent implements OnInit {
  loading: boolean;
  breadCrumbs: any[];
  cards: any[];

  dashboardsArray: any[];
  setCardObj = [];
  lastUpdatedobject: any;
  selectedDashboard: any;
  loggedInUser;
  selectedDropdownValue;
  idOfChangedDropDown: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {

    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "/ss/dashboard",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Settings",
        url: "/ss/setting",
        icon: ""
      },
      {
        name: "Card Settings",
        url: "",
        icon: ""
      },
    ]

    this.cards = [
      {
        id: 22,
        analytics_id: "COA",
        analytics_name: "Camera Occupancy Alerts",
        switch: true
      },
    ]
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    // Get all cards API
    this.getCardsSettings();
  }

  getCardsSettings() {
    this.loading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/user-analytics-setting?dashboard_id=MDSS&type_id=C`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.loading = false;
      this.cards = [];
      const dt = resp['data'];
      dt.forEach(ele => {
        if (ele.analytics_id === 'DSBC' || ele.analytics_id === 'DSTC') {
          this.cards.push({
            id: ele.id,
            name: ele.analytics_name,
            code: ele.analytics_id,
            switch: ele.switch
          });
        }
      });
    }, (err: any) => {
      this.toastr.error(err.error['message']);
      this.loading = false;
    });
  }

  saveCardSettings() {
    const slug = `${environment.baseUrlDashboard}/analytics/user-analytics-setting?dashboard_id=MDSS&type_id=C`;
    let payload = {settings: []};

    this.cards.forEach(ele => {
      payload.settings.push({id: ele.id, switch: ele.switch ? 1 : 0});
    });
    console.log(payload);

    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.getCardsSettings();
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }
}