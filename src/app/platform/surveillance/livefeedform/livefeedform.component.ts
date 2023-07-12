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
  viewsList: any[];
  selectedCameras: any[];
  cameraFeatures: any[];  
  
  data: any;
  customerId: any;
  selectedViewID: any;
  selectedViewName: any;

  previousSelectedView: any;
  selectedViewList: any[] = [];
  selectedViews: any = {};

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
    this.viewsList = [];
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
        this.viewsList.push({ id: `${i+1}`, view_no: `${i+1}`, name: `View ${i+1}`, selected: false, previousSelected: false });
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
      console.log("cameras:", this.cameras)
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
    console.log(v);
    console.log(this.viewList);
    console.log(this.selectedCameras);

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

  onChangeView(ev: any, index: number) {
    let idx = this.viewsList.findIndex(ele => {
      return ele.id === ev;
    });
    this.viewList = [];

    const tempSelection: any[] = [];


    // if (!this.selectedViewList.includes(this.viewList[idx])) {
      // this.selectedViewList.push(this.viewsList[idx]);
    // }


    this.selectedViews[index] = this.viewsList[idx];


    for (const n in this.selectedViews) {
      tempSelection.push(this.selectedViews[n])
    }



    console.log(tempSelection);

    this.viewsList.forEach(vl => {
      if (!tempSelection.includes(vl)) {
        this.viewList.push(vl)
      }
    });







    // if (idx != -1) {
    //   // const fd = this.addView.value;
    //   // const views = fd.views;

    //   // views.forEach(v => {
    //   //   this.selectedViewList.forEach(sv => {
    //   //     if (v.views != null && v.views != sv.view_no) {
    //   //       this.viewList.push(sv);
    //   //     }
    //   //   });
    //   // });

    //   // var unique_views = this.viewList.filter((elem, index, self) => {
    //   //   return index === self.indexOf(elem);
    //   // })
    //   // console.log(unique_views);
    //   // this.viewList = unique_views;
      
    //   // this.selectedViewList.push(this.viewList[idx]);




    //   // this.selectedViews[index] = this.viewsList[idx];

    //   // this.viewsList.forEach(vl => {
    //   //   if (!this.viewsList.includes(this.selectedViews[index])) {
    //   //     this.viewList.push(vl);
    //   //   }
    //   // });

    //   // this.viewsList.forEach(vl => {
    //   //   for (const key in this.selectedViews) {
    //   //     if (this.selectedViews[key].view_no !== vl.view_no) {
    //   //       this.viewList.push(vl);
    //   //       // if(!this.viewList.includes(vl)) {
    //   //       // }
    //   //     }
    //   //   }
    //   // });


    //   // this.viewList.splice(idx, 1);
    //   // console.log(this.selectedViewList);
    //   // console.log(this.selectedViews, this.viewList);
    // }
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
    // console.log(ev, this.selectedCameras);
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
