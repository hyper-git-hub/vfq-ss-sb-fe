import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-graph-settings',
  templateUrl: './graph-settings.component.html',
  styleUrls: ['./graph-settings.component.css']
})
export class GraphSettingsComponent implements OnInit {
  loading: boolean;

  breadCrumbs: any[];
  graphs: any[];
  graphArray: any[] = [];

  graphHeight = 500;
  loggedInUser: any;

  constructor(
    private apiService: ApiService,
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
        name: "Graph Settings",
        url: "",
        icon: ""
      },
    ]
    this.graphs = [];
  }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));

    // Get all Graph API
    this.getGraphSettings();
    // this.getGraphs();
  }

  getGraphSettings() {
    this.loading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/user-analytics-setting?dashboard_id=MDSS&type_id=G`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.graphs = [];
      this.graphArray = [];
      const dt = resp.data;

      setTimeout(() => {
        dt.forEach(ele => {
          if (ele.analytics_id === 'DS') {
            this.graphArray.push({
              id: ele.id,
              code: 'DS',
              analytics_type: 'G',
              name: 'Device Status',
              switch: ele.switch,
              data: [
                { country: 'Online', value: 13 },
                { country: 'Offline', value: 10 }
              ]
            });
          }
          if (ele.analytics_id === 'DD') {
            this.graphArray.push({
              id: ele.id,
              code: 'DD',
              name: 'Device Distribution',
              switch: ele.switch,
              data: [
                {
                  country: "Bulb",
                  value: 3
                },
                {
                  country: "Sockets",
                  value: 4
                },
                {
                  country: "Water Leakage",
                  value: 1
                },
                {
                  country: "Smoke Alarm",
                  value: 5
                }
              ]
            })
          }
          if (ele.analytics_id === 'MOA') {
            this.graphArray.push({
              id: ele.id,
              code: 'MOA',
              name: 'Most occupied area',
              switch: ele.switch,
              data: [
                {
                  name: "Open Area 1",
                  value: 2
                }, {
                  name: 'VFQ floor',
                  value: 3
                }
              ]
            })
          }
          if (ele.analytics_id === 'HT') {
            this.graphArray.push({
              id: ele.id,
              code: 'HT',
              name: 'Highest Temperature',
              switch: ele.switch,
              data: [
                {
                  country: "23234234",
                  visits: 5
                },
                {
                  country: "123457",
                  visits: 13
                }
              ]
            });
          }
          if (ele.analytics_id === 'HWC') {
            this.graphArray.push({
              id: ele.id,
              code: 'HWC',
              name: 'Highest Water consumption',
              switch: ele.switch,
              data: []
            });
          }
          if (ele.analytics_id === 'TC') {
            this.graphArray.push({
              id: ele.id,
              code: 'TC',
              name: 'Total Cameras',
              switch: ele.switch,
              data: [{
                name: 'Open Area 1',
                children: [{
                  name: 'Open Area 1', value: 2
                }]
              },{
                name: 'VFQ Floor',
                children: [{
                  name: 'VFQ Floor', value: 5
                }]
              }]
            });
          }
          if (ele.analytics_id === 'COA') {
            this.graphArray.push({
              id: ele.id,
              code: 'COA',
              name: 'Camera Occupancy Alerts',
              switch: ele.switch,
              data: [{
                category: 'CAM 1',
                value1: 24,
                value2: 32
              }, {
                category: 'CAM 2',
                value1: 10,
                value2: 16
              }]
            })
          }
        });
  
        this.graphArray = this.graphArray.sort((a, b) => {
          return a.id - b.id;
        });
        this.graphs = this.graphArray;
        console.log(this.graphArray);
        this.loading = false;
      }, 200);
    }, (err: any) => {
      this.loading = false;
    });
  }

  saveGraphSettings() {
    const slug = `${environment.baseUrlDashboard}/analytics/user-analytics-setting?dashboard_id=MDSS&type_id=G`;
    let payload = {settings: []};

    this.graphs.forEach(ele => {
      payload.settings.push({id: ele.id, switch: ele.switch ? 1 : 0});
    });
    console.log(payload);

    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.getGraphSettings();
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  // getGraphs() {
  //   this.graphArray = [
  //     {
  //       code: "DS",
  //       analytics_type: "G",
  //       name: "Device Status",
  //       data: {
  //         online_devices: 2,
  //         offline_devices: 4
  //       }
  //     },
  //     {
  //       code: "DD",
  //       analytics_type: "G",
  //       name: "Device Distribution",
  //       data: [
  //         {
  //           title: "Bulb",
  //           count: 0
  //         },
  //         {
  //           title: "Environment Monitoring",
  //           count: 0
  //         },
  //         {
  //           title: "Temperature",
  //           count: 1
  //         },
  //         {
  //           title: "Concox Qbit",
  //           count: 0
  //         },
  //         {
  //           title: "Smoke Alarm",
  //           count: 0
  //         },
  //         {
  //           title: "Socket",
  //           count: 1
  //         },
  //         {
  //           title: "Water Meter",
  //           count: 0
  //         },
  //         {
  //           title: "Water Leakage Sensor",
  //           count: 0
  //         },
  //         {
  //           title: "energy_meter",
  //           count: 0
  //         },
  //         {
  //           title: "camera",
  //           count: 0
  //         },
  //         {
  //           title: "Camera",
  //           count: 0
  //         }
  //       ]
  //     },
  //     {
  //       code: "MOA",
  //       analytics_type: "G",
  //       name: "Most Occupied Areas",
  //       data: {
  //         occupied_area: "Open Area 1",
  //         average: 0
  //       }
  //     },
  //     {
  //       code: "HT",
  //       analytics_type: "G",
  //       name: "Highest Temperature",
  //       data: [
  //         {
  //           device: "23234234",
  //           value: 0
  //         },
  //         {
  //           device: "123457",
  //           value: 0
  //         }
  //       ]
  //     },
  //     {
  //       code: "HWC",
  //       analytics_type: "G",
  //       name: "Highest Water Consumption",
  //       data: {
  //         "Floor 1": 5000
  //       }
  //     },
  //     {
  //       code: "TC",
  //       analytics_type: "G",
  //       name: "Total Cameras",
  //       data: [
  //         {
  //           camera_count: 1,
  //           area_name: "Open Area 1"
  //         }
  //       ]
  //     },
  //     {
  //       code: "COA",
  //       analytics_type: "G",
  //       name: "Camera Occupancy Alerts",
  //       data: [
  //         {
  //           camera_id: "CAM1",
  //           overflow: 12.10,
  //           underflow: 10
  //         }
  //       ]
  //     }
  //   ]

  //   this.graphArray.forEach((element, i) => {
  //     if (i <= 2) {
  //       let graph = this.createGraphData(element?.code, element)
  //       this.graphs.push(graph)
  //     }
  //     if (i >= 3 && i <= 4) {
  //       let graph = this.createGraphData(element?.code, element)
  //       this.graphs.push(graph)
  //     }
  //     if (i >= 5 && i <= 6) {
  //       let graph = this.createGraphData(element?.code, element)
  //       this.graphs.push(graph)
  //     }
  //   })
  // }

  // createGraphData(element, graph) {
  //   if (element === 'DS') {
  //     const dt = graph.data;
  //     console.log(graph.data);
  //     let data = [];
  //     if (dt) {
  //       data.push({ country: 'Online', value: dt['online_devices'] });
  //       data.push({ country: 'Offline', value: dt['offline_devices'] });
  //     }
  //     graph.data = data;
  //     graph.tooltip = '';
  //   }

  //   if (element === 'DD') {
  //     let data = []
  //     const dt = graph.data;
  //     dt.forEach(ele => {
  //       ele['country'] = ele.title
  //       ele['value'] = ele.count
  //     });
  //     graph.data = dt;
  //     graph.tooltip = '';
  //   }

  //   if (element === 'MOA') {
  //     let data = []
  //     for (const key in graph.data) {
  //       if (graph.data[key]) {
  //         data.push({
  //           name: key,
  //           value: graph.data[key]
  //         })
  //       }
  //     }
  //     graph.data = data;
  //     graph.tooltip = '';
  //   }

  //   if (element === 'HT') {
  //     let dt: any[] = [];
  //     if (graph.data && graph.data.length > 0) {
  //       graph.data.forEach(item => {
  //         dt.push({ country: item.device, visits: item.value });
  //         // item.country = item.device
  //         // item.visits = item.value
  //       });
  //     }
  //     graph.data = dt;
  //     graph.tooltip = '';
  //   }

  //   if (element === 'HWC') {
  //     // TODO: this will be done after hardware script is ready
  //     graph.data = [];
  //     graph.tooltip = '';
  //   }

  //   if (element === 'TC') {
  //     let data = [];
  //     console.log(graph.data, element);
  //     if (graph.data && graph.data.length > 0) {
  //       const dt = graph.data;
  //       dt.forEach(ele => {
  //         data.push({
  //           name: ele.area_name,
  //           children: []
  //         });
  //       });

  //       dt.forEach(ele => {
  //         data.forEach(elem => {
  //           if (ele.area_name === elem.name) {
  //             elem.children.push({ name: ele.area_name, value: ele.camera_count })
  //           }
  //         });
  //       });
  //     }
  //     graph.data = data;
  //     graph.tooltip = '';
  //   }


  //   if (element === 'COA') {
  //     let data = []
  //     for (const key in graph.data) {
  //       data.push({
  //         category: key,
  //         value1: graph.data[key].underflow,
  //         value2: graph.data[key].overflow,
  //       })
  //     }
  //     graph.data = data;
  //     graph.tooltip = '';
  //   }

  //   return graph
  // }

}