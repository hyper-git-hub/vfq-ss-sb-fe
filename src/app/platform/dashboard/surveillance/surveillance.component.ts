import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuildingService } from 'src/app/core/services/building.service';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { ApiService } from 'src/app/services/api.service';
import { environment, ports } from 'src/environments/environment';

@Component({
  selector: 'app-surveillance',
  templateUrl: './surveillance.component.html',
  styleUrls: ['./surveillance.component.scss']
})
export class SurveillanceComponent implements OnInit, OnDestroy {
  loading: boolean;
  showBuildingCard: boolean;
  showDevicesCard: boolean;
  
  pageIdForGraph = 'MDSS';
  breadCrumbs: any[];
  devices: any[];
  viewCounts: any[];
  building: any[] = [];
  cardDetails: any = {};
  floor: any[] = [];
  today: any[] = [];
  byfloor: any[] = [];


  defaultLoader = {
    visibility: true
  }
  customers;
  departments;
  durationOptions = [{ id: 1, name: 'Today' }, { id: 2, name: 'Yesterday' },
  { id: 3, name: 'Past 7 days' }, { id: 4, name: 'Last Month' },
  { id: 5, name: 'This Month' }, { id: 6, name: 'Past 3 Month' },
  { id: 7, name: 'Past 6 Month' }, { id: 8, name: 'This Year' },
  ]
  urlPort = ports;
  cardsArray = [];
  sliderArray = [];
  multiRows = false;
  multiCardsArray = [];
  camerasData: any[];
  graphArray: any[];
  row1 = [];
  row2 = [];
  row3 = [];
  user: any;
  customerid: any;
  userGuid: any
  cameraid: any
  totalFloors: any = 0;

  colWidth = '';
  filters = { dashboard_id: this.pageIdForGraph };
  camIds: string;
  zoomLevel: any;

  selectedBuilding: FormControl;
  player2: any;

  constructor(
    private userservice: UserserviceService,
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.user = this.authService.getUser();
    this.userGuid = this.user?.guid;
    this.customerid = this.user.customer.customer_id;

    this.loading = false;
    this.showBuildingCard = false;
    this.showDevicesCard = false;
    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Surveillance",
        url: "",
        icon: ""
      },
    ]

    this.camIds = '';
    this.zoomLevel = '1';
    this.devices = [];
    this.viewCounts = [];

    this.selectedBuilding = new FormControl(null);
  }

  ngOnInit(): void {
    // this.getGraphs();
    this.getCameraDevices();
    this.getDashboardGraphs(this.filters);
    this.getDashboardCards();
    // this.getBuildingsForDD();
    // this.getCameraDetail();

    this.floor = [
      { id: 1, name: 'Floor 1' },
      { id: 2, name: 'Floor 2' },
    ];

    this.byfloor =
      [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ];

    this.today = [
      { id: 1, name: 'Spaces 1' },
      { id: 2, name: 'Spaces 2' },
    ];
  }

  getGraphs() {
    this.graphArray = [
      {
        code: "DS",
        analytics_type: "G",
        name: "Device Status",
        data: {
          online_devices: 2,
          offline_devices: 4
        }
      },
      {
        code: "DD",
        analytics_type: "G",
        name: "Device Distribution",
        data: [
          {
            title: "Bulb",
            count: 0
          },
          {
            title: "Environment Monitoring",
            count: 0
          },
          {
            title: "Temperature",
            count: 1
          },
          {
            title: "Concox Qbit",
            count: 0
          },
          {
            title: "Smoke Alarm",
            count: 0
          },
          {
            title: "Socket",
            count: 1
          },
          {
            title: "Water Meter",
            count: 0
          },
          {
            title: "Water Leakage Sensor",
            count: 0
          },
          {
            title: "energy_meter",
            count: 0
          },
          {
            title: "camera",
            count: 0
          },
          {
            title: "Camera",
            count: 0
          }
        ]
      },
      {
        code: "MOA",
        analytics_type: "G",
        name: "Most Occupied Areas",
        data: {
          occupied_area: "Open Area 1",
          average: 0
        }
      },
      {
        code: "HT",
        analytics_type: "G",
        name: "Highest Temperature",
        data: [
          {
            device: "23234234",
            value: 0
          },
          {
            device: "123457",
            value: 0
          }
        ]
      },
      {
        code: "HWC",
        analytics_type: "G",
        name: "Highest Water Consumption",
        data: {
          "Floor 1": 5000
        }
      },
      {
        code: "TC",
        analytics_type: "G",
        name: "Total Cameras",
        data: [
          {
            camera_count: 1,
            area_name: "Open Area 1"
          }
        ]
      },
      {
        code: "COA",
        analytics_type: "G",
        name: "Camera Occupancy Alerts",
        data: [
          {
            camera_id: "CAM1",
            overflow: 0.0,
            underflow: 0.0
          }
        ]
      }
    ]

    this.graphArray.forEach((element, i) => {
      if (i <= 2) {
        let graph = this.createGraphData(element?.code, element)
        this.row1.push(graph)
      }
      if (i >= 3 && i <= 4) {
        let graph = this.createGraphData(element?.code, element)
        this.row2.push(graph)
      }
      if (i >= 5 && i <= 6) {
        let graph = this.createGraphData(element?.code, element)
        this.row3.push(graph)
      }
    })
  }

  getDashboardCards() {
    const slug = `${environment.baseUrlDashboard}${ports.monolith}/analytics/cards?dashboard_id=${this.pageIdForGraph}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp['data'].data || resp['data'];
      dt.forEach(ele => {
        if (ele.code === 'DSBC') {
          this.showDevicesCard = true;
          this.cardDetails['total_building'] = ele.data['buildings'];
          this.cardDetails['total_devices'] = ele.data['total_devices'];
          this.cardDetails['online_devices'] = ele.data['total_online_devices'];
        }
        if (ele.code === 'DSTC') {
          this.showBuildingCard = true;
          this.getBuildingsForDD();
        }
      });
    });
  }

  getBuildingsForDD() {
    const slug = `${environment.baseUrlSB}/building/`;
    this.apiService.get(slug).subscribe((resp: any) => {
      if (resp['data'] && resp['data'].data && resp['data'].data.length > 0) {
        this.building = resp['data'].data;
        this.selectedBuilding.setValue(this.building[0].id);
        this.getDashboardSliderCards(this.building[0].id)
      }
    });
  }

  getDashboardSliderCards(ev?: any) {
    const slug = `${environment.baseUrlSB}${ports.monolith}/building/building_detail/?id=${ev}`;
    this.apiService.get(slug).subscribe((data: any) => {
      if (data['data'] && data['data'] && data['data'].data.length > 0) {
        let dt = data['data'].data[0];
        let floors = dt.floors.length;
        this.totalFloors = floors > 1 ? `${floors} Floors` : `${floors} Floor`;
        this.sliderArray = dt.building_devices;
      }
    });
  }

  getDashboardGraphs(filters) {
    this.defaultLoader = { visibility: true }
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=${this.pageIdForGraph}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.graphArray = resp['data'];
      this.graphArray.forEach((element, i) => {
        if (element.code === 'DS') {
          let graph = this.createGraphData(element?.code, element)
          this.row1[0] = graph;
        }
        if (element.code === 'DD') {
          let graph = this.createGraphData(element?.code, element)
          this.row1[1] = graph;
        }
        if (element.code === 'MOA') {
          let graph = this.createGraphData(element?.code, element)
          this.row1[2] = graph;
        }
        if (element.code === 'HT') {
          let graph = this.createGraphData(element?.code, element)
          this.row2[0] = graph;
        }
        if (element.code === 'HWC') {
          let graph = this.createGraphData(element?.code, element)
          this.row2[1] = graph;
        }
        if (element.code === 'TC') {
          let graph = this.createGraphData(element?.code, element)
          this.row3[0] = graph;
        }
        if (element.code === 'COA') {
          let graph = this.createGraphData(element?.code, element)
          this.row3[1] = graph;
        }
        // if (element.code === 'DS' || element.code === 'DD' || element.code === 'MOA') {
        // }
        // if (element.code === 'HT' || element.code === 'HWC') {
        //   let graph = this.createGraphData(element?.code, element)
        //   this.row2.push(graph)
        // }
        // if (element.code === 'TC' || element.code === 'COA') {
        //   let graph = this.createGraphData(element?.code, element)
        //   this.row3.push(graph)
        // }
        // if (i <= 2) {
        // }
        // if (i >= 3 && i <= 4) {
        //   let graph = this.createGraphData(element?.code, element)
        //   this.row2.push(graph)
        // }
        // if (i >= 5 && i <= 6) {
        //   let graph = this.createGraphData(element?.code, element)
        //   this.row3.push(graph)
        // }
      })
    })
  }

  getCameraDevices() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    url.searchParams.set('device_type', 'camera');
    // url.searchParams.set('customer_id', this.customerid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = resp.data['data'];

      const dt = resp.data['data'];
      if (!!dt) {
        dt.forEach((ele, idx) => {
          this.camIds += ele.device;
          this.playCameras(ele.device);
          if (idx !== dt.length - 1) {
            this.camIds += ',';
          }
        });
      }

      if (!!this.camIds && this.camIds !== '') {
        this.getCameraViews();
      } else {
        this.loading = false;
        this.toastr.info('No camera device assigned to this customer');
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  getCameraViews() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/views/`);
    url.searchParams.set('camera_ids', this.camIds);
    url.searchParams.set('guid', this.userGuid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.viewCounts = resp.data.data;

      this.devices.forEach(dev => {
        this.viewCounts.forEach((element: Object, idx) => {
          if (element.hasOwnProperty(dev.device)) {
            dev.views_count = element[dev.device];
          }
        });
      });
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  playCameras(cameraID: any = 'CAM1') {
    let url = new URL(`${environment.baseUrlLiveStream}/camera/stream`);
    let payload = { ip_address: '51.144.150.199', camera_id: cameraID };
    this.apiService.post(url.href, payload).subscribe((resp: any) => {
      this.setupSocket(resp['socket_port'], cameraID);
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error playing live stream');
    });
  }

  setupSocket(port: any, device: any) {
    setTimeout(() => {
      // let url = `wss://staging.gateway.iot.vodafone.com.qa/sb_node_live_stream:${port}`;
      let url = `${environment.websocketUrl}/test?cameraId=${device}`;
      let idx = this.devices.findIndex(ele => {
        return ele.device === device;
      });

      // @ts-ignore JSMpeg defined via script
      // let player = new JSMpeg.VideoElement("#video-canvas", url)
      var canvas = document.getElementById(this.devices[idx]?.id);
      // @ts-ignore JSMpeg defined via script
      this.player2 = new JSMpeg.Player(url, { canvas: canvas });
      console.log(this.player2);
    }, 1000);
  }

  moveCamera(ev: any, camId: any) {
    this.loading = true;
    const slug = `${environment.baseUrlStreaming}/surveillance/cameraptz/`;
    let payload = { stepY: '1', direct: ev, stepX: '1', command: '1', camera_id: camId };

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Unable to move camera');
    });
  }

  onZoomCamera(ev: any, camId: any) {
    let zoomLevel = ev.target.value;
    this.zoomLevel = ev.target.value;
    this.loading = true;
    const slug = `${environment.baseUrlStreaming}/surveillance/cameraptz/`;
    let payload = { direct: zoomLevel, command: "1", step: "1", camera_id: camId };

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], `Unable to zoom ${zoomLevel == '1' ? 'in' : 'out'}`);
    });
  }

  getCameraDetails(filters: any): void {
    this.camerasData = [];
    let url = new URL(`${environment.baseUrlSS}/manage-camera`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.cameraid = dt.map(t => t.id);
      dt.forEach(element => {
        this.camerasData.push({
          camera_name: element.camera_name,
          camera_id: element.camera_id,
          url: `https://dev.gateway.iot.vodafone.com.qa/ss-camera/liveserver/${element.camera_id}/out.m3u8`,
          views: element.views,
          downloads: element.downloads
        });
      });
      //  this.loading = false;

    }, (err: any) => {
      //  this.loading = false;
    });
  }

  patchCameraViews() {
    let payload: any = {};
    if (this.camIds != '') {
      payload = {
        camera: this.cameraid,
        guid: this.userGuid
      }
    }
    const slug = `${environment.baseUrlSB}/building/views/`;

    this.apiService.patch(slug, payload).subscribe((resp: any) => { }, (err: any) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  getCameraDetail(): void {
    this.camerasData = [];
    this.loading = true;
    let params = `customer_id=${this.customerid}&dashboard=${true}&guid=${this.userGuid}`;
    this.userservice.getCameraDetail(params, this.urlPort.monolith)
      .subscribe((resp: any) => {
        const dt = resp.data;
        this.cameraid = dt.map(t => t.id);
        dt.forEach(element => {
          this.camerasData.push({
            camera_name: element.camera_name,
            camera_id: element.camera_id,
            url: `https://dev.gateway.iot.vodafone.com.qa/ss-camera/liveserver/${element.camera_id}/out.m3u8`,
            views: element.views,
            downloads: element.downloads
          });
        });

        this.loading = false;

      }, (err: any) => {
        this.loading = false;
      });
  }

  createGraphData(element, graph) {
    if (element === 'DS') {
      const dt = graph.data;
      let data = [];
      if (dt) {
        data.push({ country: 'Online', value: dt['online_devices'] });
        data.push({ country: 'Offline', value: dt['offline_devices'] });
        // for (const key in dt) {
        //   console.log(key, dt[key]);
        //   if (dt['offline_devices']) {
        //     data.push({ country: "Offline", value: dt['offline_devices'] });
        //   }
        //   if (dt['online_devices']) {
        //     data.push({ country: "Online", value: dt['online_devices'] });
        //   }
        // }
      }
      graph.data = data;
      graph.tooltip = '';
    }

    if (element === 'DD') {
      let data = []
      // console.log(graph.data);
      const dt = graph.data;
      dt.forEach(ele => {
        ele['country'] = ele.title
        ele['value'] = ele.count
      });

      // for (const key in graph.data) {
      //   if (graph.data[key]) {
      //     data.push({
      //       country: key,
      //       value: graph.data[key]
      //     })
      //   }
      // }

      // console.log(data, dt);
      graph.data = dt;
      graph.tooltip = '';
    }

    if (element === 'MOA') {
      let data = [];
      for (const key in graph.data) {
        data.push({
          name: key,
          value: graph.data[key]
        })
      }
      graph.data = data;
      graph.tooltip = '';
    }

    if (element === 'HT') {
      let dt: any[] = [];
      if (graph.data && graph.data.length > 0) {
        graph.data.forEach(item => {
          dt.push({ country: item.device, visits: item.value });
          // item.country = item.device
          // item.visits = item.value
        });
      }
      graph.data = dt;
      graph.tooltip = '';
    }

    if (element === 'HWC') {
      // TODO: this will be done after hardware script is ready
      graph.data = [];
      graph.tooltip = '';
    }

    if (element === 'TC') {
      let data = [];
      if (graph.data && graph.data.length > 0) {
        const dt = graph.data;
        dt.forEach(ele => {
          data.push({
            name: ele.area_name,
            children: []
          });
        });

        dt.forEach(ele => {
          data.forEach(elem => {
            if (ele.area_name === elem.name) {
              elem.children.push({ name: ele.area_name, value: ele.camera_count })
            }
          });
        });
        // for (const key in graph.data) {
        //   // TODO: wrong here we have multiple device types and building attributes, this need to change
        //   data.push({
        //     name: 'floor' + graph.data[key].floor,
        //     children: []
        //   })
        //   graph.data.forEach(element => {
        //     if (element.floor === graph.data[key].floor) {
        //       data[key].children.push({
        //         name: data[key].name,
        //         value: element?.camera_count
        //       })
        //     }
        //   });
        // }
      }
      // console.log(data);
      graph.data = data;
      graph.tooltip = '';
    }


    if (element === 'COA') {
      let data = []
      for (const key in graph.data) {
        // console.log(key);
        data.push({
          category: key,
          value1: graph.data[key].underflow,
          value2: graph.data[key].overflow,
        })
      }
      // console.log(data)
      graph.data = data;
      graph.tooltip = '';
    }

    return graph
  }

  scrollLeft(el: Element) {
    const animTimeMs = 400;
    const pixelsToMove = 228;
    const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
    interval(animTimeMs / 8).pipe(
      takeWhile(value => value < 8),
      tap(value => el.scrollLeft -= (pixelsToMove * stepArray[value])),
    ).subscribe();
  }

  scrollRight(el: Element) {
    const animTimeMs = 400;
    const pixelsToMove = 228;
    const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
    interval(animTimeMs / 8).pipe(
      takeWhile(value => value < 8),
      tap(value => el.scrollLeft += (pixelsToMove * stepArray[value])),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.patchCameraViews();
    // console.log();
    // this.player2.stop()
  }
}
