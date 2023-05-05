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
  bySec: any[] = []
  livefeedTableConfig: TableConfig;
  actions: Subject<any> = new Subject();
  livefeedListingData: any[];
  catagory: any;
  data: any;
  viewList: any[] = []
  listLobby: any[] = [];
  cameraFeatures: any[];
  listHall: any[] = [];
  listRoom: any[] = [];
  cameraList: any[] = []
  cameras: any[] = []
  viewCam: any[] = []
  finaViewCam: any[] = []
  cameraName: any


  addView: FormGroup;
  editView: FormGroup
  objectArray: any;




  constructor(private modalRef: NgbActiveModal,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder) {

    this.bySec = [
      { id: '1', name: 'Lobby' },
      { id: '2', name: 'Hallway' },
      { id: '3', name: 'Room' },
    ];
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




    this.addView = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      address: fb.array([])
    });



    this.editView = new FormGroup({
      space: new FormControl(null,),
      camera_views: new FormControl(null),
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


    console.log("viewList:", this.viewList)
    if (this.data.layout == 2) {
      this.viewList = [
        { id: '1', name: 'View 1' },
        { id: '2', name: 'View 2' },
        { id: '3', name: 'View 3' },
        { id: '4', name: 'View 4' },
      ];
      this.addNewAddressGroup();
      this.addNewAddressGroup();
      this.addNewAddressGroup();
    }
    if (this.data.layout == 3) {
      this.viewList = [
        { id: '1', name: 'View 1' },
        { id: '2', name: 'View 2' },
        { id: '3', name: 'View 3' },
        { id: '4', name: 'View 4' },
        { id: '5', name: 'View 5' },
        { id: '6', name: 'View 6' },
        { id: '7', name: 'View 7' },
        { id: '8', name: 'View 8' },
        { id: '9', name: 'View 9' }
      ];
    }
  }

  addNewAddressGroup() {
    const add = this.addView.get('address') as FormArray;
    add.push(this.fb.group({
      views: [],
      camera: []
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
    console.log(" the Sec Area == ", ev)

  }
  onChangeCam(ev: any) {
    console.log("The Changes of Camera ==> ", ev)

  }

  getCameraDevices() {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);

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
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }
  onSubmit() {
    const formData = this.addView.value;
    this.viewCam = formData.address;
    // console.log("viewCam:", this.viewCam);
    console.log("formData:", formData);
    let payload: any = {
      view_name: formData.name,
      display_phenomenun: []
    }
    console.log("payload:",payload)
    if (this.addView.invalid) {
      return;
    }

    if (this.editView.invalid) {
      return;
    }

    this.viewCam.forEach(element => {
      if (element.views && element.camera) {
        payload.display_phenomenun.push({ view_no: element.views, camera_id: element.camera })
        this.finaViewCam.push(payload.display_phenomenun)
        // console.log("this.finaViewCam.this.finaViewCam:",this.finaViewCam)
      }



    });
    console.log("this.catagory == > ", this.catagory)
    if (this.catagory === 'edit') {
      console.log(" the val", this.editView.value)
    }

    else if (this.catagory === 'add') {
      let slug = `${environment.baseUrlSB}/building/display/`;
      let finalpayload: any = {
        view_name: payload.view_name,
        display_phenomenun :this.finaViewCam[0]
      }

      console.log("finalpyaload:",finalpayload)

      if (this.catagory === 'edit') {
        slug = `${environment.baseUrlSB}/building/display/`
        // this.updateDisplay(slug, payload);
      } else {
        // console.log("add final payload:", payload)
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
  // onAreaSelect(ev: any) {
  //   console.log(" the Sec Area ", ev)
  // }
  checkSection(event: any) {
    console.log(" the event data", event)
  }

  onAreaSelect(ev: any) {
    console.log(" The Selected Area ", ev)
    if (ev === '1') {
      this.viewList = this.listLobby
      console.log("viewList:", this.viewList)
    }
    else if (ev === '2') {
      this.viewList = this.listHall
    }
    else if (ev === '3') {
      this.viewList = this.listRoom
    }
  }


}
