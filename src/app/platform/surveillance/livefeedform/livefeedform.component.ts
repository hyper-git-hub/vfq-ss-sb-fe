import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-livefeedform',
  templateUrl: './livefeedform.component.html',
  styleUrls: ['./livefeedform.component.scss']
})
export class LivefeedformComponent implements OnInit {
  loading: boolean;

  title: string;
  category: string;
  
  addView: FormGroup;
  editView: FormGroup;

  cameras: any[];
  displayData: any[];
  viewList: any[];
  selectedCameras: any[];
  cameraFeatures: any[];  
  
  data: any;
  customerId: any;
  selectedViewID: any;
  selectedViewName: any;

  previousSelectedView: any;

  constructor (
    private modalRef: NgbActiveModal,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.loading = false;
    this.title = 'Add View';
    this.category = 'add';

    this.cameras = [];
    this.displayData = [];
    this.viewList = [];
    this.selectedCameras = [];
    this.cameraFeatures = [];

    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];

    this.addView = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      views: fb.array([])
    });

    this.editView = new FormGroup({
      space: new FormControl(null, [Validators.required]),
      views: fb.array([])
    });

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
    this.getDisplay();

    if (this.data && this.category == 'add') {
      let layout = this.data.layout;
      for(let i = 0; i < layout * layout; i++) {
        this.viewList.push({ id: `${i+1}`, view_no: `${i+1}`, name: `View ${i+1}`, selected: false, previousSelected: false });
        this.addViewGroup();
      }
      // this.editViewGroup();
    }
  }

  addViewGroup() {
    const add = this.addView.get('views') as FormArray;
    add.push(this.fb.group({
      views: [],
      camera: []
    }))
  }

  editViewGroup() {
    const edit = this.editView.get('views') as FormArray;
    edit.push(this.fb.group({
      camera_views: [],
    }))
  }

  getCameraDevices() {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    url.searchParams.set('device_type', 'camera');

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.cameras = [];
      const dt: any = resp.data['data'];
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
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/display/?customer=${this.customerId}`;
    
    this.apiService.get(slug).subscribe((resp: any) => {
      this.displayData = resp.data['data'];
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting layout preferances');
    });
  }

  onSubmit() {
    if (this.addView.invalid) {
      return;
    }
    const fd = this.addView.value;
    const views = fd.views;

    let payload: any = {
      view_name: fd.name,
      display_phenomenun: []
    }

    views.forEach(element => {
      if (element.views && element.camera) {
        payload.display_phenomenun.push({ view_no: element.views, camera_id: element.camera })
      }
    });

    // console.log(views, payload);
    // return;

    let slug = `${environment.baseUrlSB}/building/display/`;
    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
      this.onCloseModel();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error creating views');
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

  deleteView(idx) {
    this.viewList.splice(idx, 1);
  }

  onViewSelect(ev: any) {
    this.viewList = [];
    this.selectedCameras = [];
    // const views: any[] = [];

    this.cameras.forEach(ele => {
      this.selectedCameras.push(ele);
    });
    this.selectedViewID = ev.id;
    this.selectedViewName = ev.view_name;
    // this.viewList = ev.display_phenomenun;
    const v = ev.display_phenomenun;
    const layout = this.data.layout;

    for(let i = 0; i < layout * layout; i++) {
      this.viewList.push({ id: `${i+1}`, view_no: `${i+1}`, name: `View ${i+1}` });
    }

    v.forEach(element => {
      this.viewList.forEach(ele => {
        if (element.view_no === ele.view_no) {
          ele['camera_id'] = element.camera_id;
          this.onSelectCamera(element);
        }
      });
    });


    // ev.display_phenomenun.forEach(element => {
    //   this.cameras.forEach(elem => {
    //     if (element.camera_id === elem.device) {
    //       views.push(element);
    //       this.viewList = views;
    //       // this.editView.patchValue({
    //       //   camera_views: element.camera_id
    //       // });
    //     }
    //   });
    // });
  }

  onChangeView(ev: any) {
    let idx = this.viewList.findIndex(ele => {
      return ele.id === ev;
    });

    if (idx != -1) {
      this.viewList.splice(idx, 1);
    }
  }

  onChangeCam(ev: any) {
    let idx = this.cameras.findIndex(ele => {
      return ele.device === ev;
    });

    if (idx != -1) {
      this.cameras.splice(idx, 1);
    }
  }

  onSelectCamera(ev: any) {
    let idx = this.selectedCameras.findIndex(ele => {
      return ev.device == ele.camera_id;
    });

    if (idx != -1) {
      this.selectedCameras.splice(idx, 1);
    }
  }

  onCloseModel() {
    this.modalRef.close();
  }
}
