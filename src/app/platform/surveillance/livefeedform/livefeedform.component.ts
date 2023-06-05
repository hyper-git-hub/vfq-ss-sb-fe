import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { livefeedTableConfig } from './livefeedform-config';
import { TableConfig } from 'src/app/shared/general-table/model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-livefeedform',
  templateUrl: './livefeedform.component.html',
  styleUrls: ['./livefeedform.component.scss']
})
export class LivefeedformComponent implements OnInit {
  listData: any[];
  title: any;
  loading: boolean;
  // bySec: any[] = []
  livefeedTableConfig: TableConfig;
  actions: Subject<any> = new Subject();
  livefeedListingData: any[];
  catagory: any;
  data: any;
  data1: any;
  viewList: any[] = [];
  displayData: any[];
  listLobby: any[] = [];
  cameraFeatures: any[];
  listHall: any[] = [];
  listRoom: any[] = [];
  final: any[] = [];
  cameraList: any[] = []
  cameras: any[] = []
  viewCam: any[] = []
  viewCamEdit: any[] = []
  devices: any[] = []
  finaViewCam: any[] = []
  cameraName: any;
  customerId: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  addView: FormGroup;
  editView: FormGroup
  objectArray: any;

  selectedViewID: any;
  selectedViewName: any;



  constructor(private modalRef: NgbActiveModal,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.passEntry = new EventEmitter<any>();
    // this.bySec = [
    //   { id: '1', name: 'Lobby' },
    //   { id: '2', name: 'Hallway' },
    //   { id: '3', name: 'Room' },
    // ];
    this.listLobby = [
      { id: '1', name: 'view 1' },
      { id: '2', name: 'view 2' },
      { id: '3', name: 'view 3' },
      { id: '3', name: 'view 4' },
      { id: '3', name: 'view 5' },
      { id: '3', name: 'view 6' },
    ];
    this.listHall = [
      { id: '1', name: 'view 1' },
      { id: '2', name: 'view 2' },
      { id: '3', name: 'view 3' },
      { id: '3', name: 'view 4' },

    ];
    this.listRoom = [
      { id: '1', name: 'view 1' },
      { id: '2', name: 'view 2' },
      { id: '3', name: 'view 3' },

    ];
    this.cameraList = [
      { id: '1', name: 'camera 1' },
      { id: '2', name: 'camera 2' },
      { id: '3', name: 'camera 3' },
    ];
    this.cameraFeatures = [];
    // this.devices = [];
    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];

    this.addView = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      address: fb.array([])
    });

    this.editView = new FormGroup({
      space: new FormControl(null, [Validators.required]),
      addressedit: fb.array([])
    });


    this.livefeedTableConfig = new TableConfig(livefeedTableConfig.config);
    this.actions.next({ action: 'loadingTrue' })

    const cf: any = JSON.parse(localStorage.getItem('camera_features'));
    if (cf.length > 0) {
      cf.forEach(element => {
        element = element.replace('cam_', '');
        this.cameraFeatures.push(element);
      });
    }

  }


  ngOnInit(): void {
    this.getCameraDevices();
    this.addNewAddressGroup();
    this.getDisplay();

    if (this.data.layout == 2) {
      this.viewList = [
        { id: '1', name: 'View 1' },
        { id: '2', name: 'View 2' },
        { id: '3', name: 'View 3' },
        { id: '4', name: 'View 4' },
      ];
      for(let i=1; i<this.viewList.length; i++)
      {
        this.addNewAddressGroup();
      }
    
      this.addNewAddressGroupEdit();

    }
    if (this.data.layout == 3) {
      this.viewList = [
        { view_no: '1', name: 'View 1' },
        { view_no: '2', name: 'View 2' },
        { view_no: '3', name: 'View 3' },
        { view_no: '4', name: 'View 4' },
        { view_no: '5', name: 'View 5' },
        { view_no: '6', name: 'View 6' },
        { view_no: '7', name: 'View 7' },
        { view_no: '8', name: 'View 8' },
        { view_no: '9', name: 'View 9' }
      ];

      for(let i=1; i<this.viewList.length; i++)
      {
        this.addNewAddressGroup();
      }

      this.addNewAddressGroupEdit();
      this.addNewAddressGroupEdit();
      this.addNewAddressGroupEdit();
      this.addNewAddressGroupEdit();
      this.addNewAddressGroupEdit();
    }
  }

  addNewAddressGroup() {
    const add = this.addView.get('address') as FormArray;
    add.push(this.fb.group({
      views: [],
      camera: []
    }))
  }

  addNewAddressGroupEdit() {
    const edit = this.editView.get('addressedit') as FormArray;
    edit.push(this.fb.group({
      camera_views: [],
    }))
  }


  onCloseModel() {
    this.modalRef.close(this.listData);
  }

  onDelete(row: any) {
    throw new Error('Method not implemented.');
  }
  onConfirm(row: any, arg1: number) {
    throw new Error('Method not implemented.');
  }


  onChangeView(ev: any) {
    // console.log(" the Sec Area == ", ev)

  }
  onChangeCam(ev: any) {
    // console.log("The Changes of Camera ==> ", ev)

  }

  getCameraDevices() {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    url.searchParams.set('device_type', 'camera');

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.cameras = [];
      const dt = resp.data['data'];
      dt.forEach(dev => {
        this.cameraFeatures.forEach(ele => {
          if (dev.device === ele) {
            this.cameras.push(dev);
          }
        });
      });
      // console.log("cameras:", this.cameras)
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  getDisplay() {
    this.displayData = [];
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/display/?customer=${this.customerId}`;

    this.apiService.get(slug).subscribe((resp: any) => {
      this.displayData = resp.data['data'];
      // console.log("displayData:", this.displayData)

      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting layout preferances');
    });
  }
  onSubmit() {
    const formData = this.addView.value;
    const formDataEdit = this.editView.value;
    // console.log("formDataEdit:", formDataEdit)
    this.viewCam = formData.address;
    this.viewCamEdit = formData.addressedit;
    // console.log("viewCam:", this.viewCam)
    // console.log("viewCam:", this.viewCamEdit)
    let payload: any = {
      view_name: formData.name,
      display_phenomenun: []
    }
    let payloadEdit: any = {
      view_name: formDataEdit.name,
      display_phenomenun: []
    }
    if (this.addView.invalid) {
      return;
    }

    // if (this.editView.invalid) {
    //   return;
    // }

    this.viewCam.forEach(element => {
      if (element.views && element.camera) {
        payload.display_phenomenun.push({ view_no: element.views, camera_id: element.camera })
        this.finaViewCam.push(payload.display_phenomenun)
      }
    });

    // console.log("this.catagory == > ", this.catagory)
    if (this.catagory === 'edit') {
      this.viewCamEdit.forEach(element => {
        if (element.views && element.camera) {
          payload.display_phenomenun.push({ view_no: element.views, camera_id: element.camera })
          this.finaViewCam.push(payload.display_phenomenun)
        }
      });

      // console.log(" the val", this.editView.value)
    }

    else if (this.catagory === 'add') {
      let slug = `${environment.baseUrlSB}/building/display/`;
      let finalpayload: any = {
        view_name: payload.view_name,
        display_phenomenun: this.finaViewCam[0]
      }


      if (this.catagory === 'edit') {
        slug = `${environment.baseUrlSB}/building/display/`
        // this.updateDisplay(slug, payload);
      } else {
        // console.log("add final payload:", finalpayload)
        this.createDisplay(slug, finalpayload);
      }
    }
  }

  deleteRow(x) {
    // var delBtn = confirm(" Do you want to delete ?");
    // if ( delBtn == true ) {
    this.viewList.splice(x, 1);
    // }   
  }

  createDisplay(slug: string, finalpayload: any) {
    this.apiService.post(slug, finalpayload).subscribe((resp: any) => {
      const dt = resp.data.display_phenomenun;
      // console.log("dt:", dt)
      dt.forEach(element => {
        this.data1.forEach(elem => {
          if (element.camera_id === elem.device) {
            this.final.push(elem);
            // console.log("final:", this.final)
            this.passEntry.emit(this.final);
          }
        });
      });
      this.toastr.success(resp.message);
      // this.loading = false;
      this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
      // this.loading = false;
      this.modalRef.close();
      // this.loading = false;
    });
  }

  onUpdate() {
    this.loading = true;
    let slug = `${environment.baseUrlSB}/building/display/`;
    let payload = { id: this.selectedViewID, view_name: this.selectedViewName, display_phenomenun: this.viewList };

    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.loading = false;
      this.modalRef.close();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message, 'Error updating view');
    });
  }

  updateDisplay(devicename) {
    // console.log(devicename)
    let slug = `${environment.baseUrlDevice}/api/device`;
    let payload: any = {
      device_id: this.data.device,
      device_name: devicename,
    }
    // console.log(payload)
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success("Record updated successfully");
      this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }
  // onAreaSelect(ev: any) {
  //   console.log(" the Sec Area ", ev)
  // }
  checkSection(event: any) {
    // console.log(" the event data", event)
  }
  camList = [];
  onViewSelect(ev: any) {
    this.final = [];
    this.selectedViewID = ev.id;
    this.selectedViewName = ev.view_name;
    // console.log(" The Selected Area ", ev);
    // console.log(" cameras", this.cameras)
    this.viewList = ev.display_phenomenun;

    // this.cameras = this.viewList
    ev.display_phenomenun.forEach(element => {
      this.cameras.forEach(elem => {
        if (element.camera_id === elem.device) {
          // this.cameras.push(elem);
          this.final.push(element);
          // console.log("final:", this.final)
          // console.log(element.camera_id);
          this.viewList = this.final;
          this.editView.patchValue({
            camera_views: element.camera_id
          });
        }
      });
    });

    // console.log(" form-group ", this.editView)

    // this.editView.patchValue({
    //   camera_views: ev.camera_id,
    // });
    // if (ev === '1') {
    //   this.viewList = this.listLobby
    //   console.log("viewList:", this.viewList)
    // }
    // else if (ev === '2') {
    //   this.viewList = this.listHall
    // }
    // else if (ev === '3') {
    //   this.viewList = this.listRoom
    // }
  }


}
