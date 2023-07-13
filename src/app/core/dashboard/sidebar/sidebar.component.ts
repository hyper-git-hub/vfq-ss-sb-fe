import { Component, Input, OnInit } from '@angular/core';

import { Menu } from 'src/app/interfaces/model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menu: Menu[];
  menus: Menu[];
  finalMenu: Menu[];
  features: any[];
  @Input() isCollapsed: boolean;

  constructor() {
    this.isCollapsed = false;
    this.menus = [];
    this.features = [];

    this.finalMenu = [];

    this.menu = [
      {
        id: 1,
        name: 'Dashboard',
        icon: 'ri-pie-chart-box-line',
        route: 'dashboard',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.501145Z',
        modified_at: '2021-10-21T09:55:13.501168Z',
        sub_menu: [
          {
            id: 300,
            name: 'Overall',
            icon: 'ri-admin-line',
            route: '/ss/dashboard/surveillance',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          // {
          //   id: 301,
          //   name: 'Occupancy',
          //   icon: 'ri-admin-line',
          //   route: '/ss/dashboard/occupancy',
          //   is_parent: false,
          //   created_at: '2021-10-21T09:55:13.509101Z',
          //   modified_at: '2021-10-21T09:55:13.509121Z',
          //   sub_menu: [],
          //   permission: ['RW']
          // },
        ],
      },
      {
        id: 2,
        name: 'Surveillance',
        icon: 'ri-phone-camera-line',
        route: 'surveillance',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 302,
            name: 'Live Feed',
            icon: 'ri-admin-line',
            route: '/ss/surveillance/live-feed',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          {
            id: 303,
            name: 'Play Back',
            icon: 'ri-admin-line',
            route: '/ss/surveillance/play-back',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
          {
            id: 304,
            name: 'Geo Zone',
            icon: 'ri-admin-line',
            route: '/ss/surveillance/geo-zone',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
          {
            id: 305,
            name: 'Manage Camera',
            icon: '',
            route: '/ss/surveillance/manage-cameras',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
        ]
      },
      {
        id: 3,
        name: 'Smart Control',
        icon: 'ri-u-disk-line',
        route: 'smart-control',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 306,
            name: 'Bulb',
            icon: 'ri-admin-line',
            route: '/ss/smart-control/bulb',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          {
            id: 307,
            name: 'Socket',
            icon: 'ri-admin-line',
            route: '/ss/smart-control/socket',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
        ]
      },
      {
        id: 4,
        name: 'Smart Alarm',
        icon: 'ri-alarm-line',
        route: 'smart-alarm',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 308,
            name: 'Smoke',
            icon: '',
            route: '/ss/smart-alarm/smoke',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          {
            id: 309,
            name: 'Water Leakage',
            icon: '',
            route: '/ss/smart-alarm/water-leakage',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
        ]
      },
      {
        id: 5,
        name: 'Utilities',
        icon: 'ri-boxing-line',
        route: 'utilities',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 310,
            name: 'Energy Meter',
            icon: '',
            route: '/ss/utilities/energy-meter',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            permission: ['RW']
          },
          {
            id: 311,
            name: 'Water Meter',
            icon: '',
            route: '/ss/utilities/water-meter',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.512611Z',
            modified_at: '2021-10-21T09:55:13.512630Z',
            sub_menu: [],
            permission: ['R']
          },
        ]
      },
      {
        id: 312,
        name: 'Temperatures',
        icon: 'ri-temp-hot-line',
        route: '/ss/temperature',
        is_parent: false,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [],
        permission: ['RW']
      },
      {
        id: 313,
        name: 'Scheduling',
        icon: 'ri-calendar-event-fill',
        route: '/ss/scheduling',
        is_parent: false,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [],
        permission: ['RW']
      },
      {
        id: 6,
        name: 'Manage Building',
        icon: 'ri-building-line',
        route: 'manage-building',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 314,
            name: 'Building',
            icon: 'ri-admin-line',
            route: '/ss/manage-building/building',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          }
        ]
      },
      {
        id: 12,
        name: 'Users & Admin',
        icon: 'ri-admin-line',
        route: 'user-admin',
        is_parent: true,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
          {
            id: 315,
            name: 'Users',
            icon: 'ri-admin-line',
            route: '/ss/user-admin/users',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          {
            id: 316,
            name: 'Roles & permissions',
            icon: 'ri-admin-line',
            route: '/ss/user-admin/role-permission',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
          {
            id: 317,
            name: 'Configurations',
            icon: 'ri-admin-line',
            route: '/ss/user-admin/configurations',
            is_parent: false,
            created_at: '2021-10-21T09:55:13.509101Z',
            modified_at: '2021-10-21T09:55:13.509121Z',
            sub_menu: [],
            permission: ['RW']
          },
        ]
      },
      {
        id: 318,
        name: 'Reports',
        icon: 'ri-numbers-line',
        route: 'reports',
        is_parent: false,
        created_at: '2021-10-21T09:55:13.505242Z',
        modified_at: '2021-10-21T09:55:13.505261Z',
        sub_menu: [
        ]
      },
      {
        id: 319,
        name: 'Alerts',
        icon: 'ri-alert-line',
        route: '/ss/alerts',
        is_parent: false,
        created_at: '2021-10-21T09:55:13.501145Z',
        modified_at: '2021-10-21T09:55:13.501168Z',
        sub_menu: [],
        permission: ['R']
      },
      {
        id: 320,
        name: 'Audit',
        icon: 'ri-file-text-line',
        route: '/ss/audit',
        is_parent: false,
        created_at: '2021-10-21T09:55:13.501145Z',
        modified_at: '2021-10-21T09:55:13.501168Z',
        sub_menu: [],
        permission: ['R']
      },
    ]

    const fea: any[] = JSON.parse(localStorage.getItem('features'));
    this.features = fea;
    // this.features = [300, 302, 304];
    // console.log(this.features);
  }

  ngOnInit(): void {
    // this.menus = this.menu;
    this.setMenu();
  }

  setMenu() {
    this.menu.forEach((menu, idx) => {
      if (menu.is_parent && menu.sub_menu.length > 0) {

        const m = this.menu[idx];
        this.finalMenu = [];
        this.menus.push(m);
        // console.log(m, this.menus);

        menu.sub_menu.forEach(sm => {
          if (this.features.includes(sm.id)) {
            this.finalMenu.push(sm);
          }
        });
        m.sub_menu = this.finalMenu;
        if (this.finalMenu.length === 0) {
          let ix = this.menus.findIndex(ele => {
            return ele.name === m.name;
          });
          this.menus.splice(ix, 1);
        }
      } else {
        if (this.features.includes(menu.id)) {
          this.menus.push(menu);
        }
      }
      // this.features.forEach(ele => {
      // if (menu.id === ele) {
      // }
      // });
    });
    // console.log(this.menus);
  }

  onSelectedItem(menu: any, idx: number) {
    menu[idx].expanded = !menu[idx].expanded;
    for (let i = 0; i < menu.length; i++) {
      if (menu[idx].expanded) {
        menu[i].expanded = false;
        menu[idx].expanded = true;
      } else {
        menu[idx].expanded = false;
      }
    }
  }

}
