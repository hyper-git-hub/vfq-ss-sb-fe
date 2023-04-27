import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { TableConfig } from 'src/app/shared/general-table/model';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagecameraformComponent } from '../managecameraform/managecameraform.component';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { environment, ports } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { manageCameraFormConfig, manageCameraTableConfig, MSTATUS, STATUS } from './config';
import { ApiService } from 'src/app/services/api.service';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';



@Component({
  selector: 'app-manage-cameras',
  templateUrl: './manage-cameras.component.html',
  styleUrls: ['./manage-cameras.component.scss']
})
export class ManageCamerasComponent implements OnInit {


  breadCrumbs: any[];
  actions: Subject<any> = new Subject();
  formConfig: FormConfig;
  CameraListingData: any[];
  manageCameraTableConfig: TableConfig;

  filterForm: FormGroup
  urlPort = ports;
  user: any;
  readonly:boolean
  customerId: any;
  count: number = 0;
  filters: any;
  cameras: any;
  filterCamera = { limit: 10, offset: 0, order_by: '', order: '' };

  cameraForm: FormGroup;
  loading: boolean;

  constructor(private dialog: NgbModal, public formBuilder: FormBuilder,
    public userservice: UserserviceService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private authService: AuthService) {

    this.user = this.authService.getUser();
    this.customerId = this.user.customer.customer_id;
    this.loading = false;
    const user: any = JSON.parse(localStorage.getItem('user'));
    this.readonly = user.write ? false : true;

    this.formConfig = new FormConfig(manageCameraFormConfig.config);

    this.breadCrumbs = [
      {
        name: "Surveillance Managment",
        url: "/ss/surveillance-manage/manage-cameras",
        icon: "ri-focus-3-line"
      },
      {
        name: "Manage Camera",
        url: "",
        icon: ""
      },
    ]
    this.filterForm = this.formBuilder.group({
      id: [null],
      buildings: [null, [Validators.required]],
      types: [null, [Validators.required]],
      floors: [null, [Validators.required]],
      spaces: [null, [Validators.required]],
    });

    this.manageCameraTableConfig = new TableConfig(manageCameraTableConfig.config);

    this.cameras = null;
    this.filters = { limit: 10, offset: '0', customer_id: this.customerId, device_type: 'camera' };
  }

  ngOnInit(): void {
    this.defineFormats();
    this.getCameralisting(this.filters);
  }

  defineFormats() {
    FORMATS['status'] = STATUS;
    FORMATS['motion-status'] = MSTATUS;
    // return FORMATS;
  }

  onTableSignals(ev: any) {
    if (ev.type === 'onEdit') {
      this.AddManageCamera(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeallocateCamera(ev.row);
    // } else if (ev.type === 'onSetting') {
    //   this.onDelete(ev.row, 1);
    } else if (ev.type === 'onSorting') {
      this.filters.order = ev.data['direction'];
      this.filters.order_by = ev.data['column'];
      this.getCameralisting(this.filters);
    } else if (ev.type === 'onPagination') {
      this.filters.limit = ev.data['limit'];
      this.filters.offset = ev.data['offset'];
      this.getCameralisting(this.filters);
    } else if (ev.type === 'searchTable') {
      this.filters.search = ev.data;
      this.getCameralisting(this.filters);
    }
  }


  AddManageCamera(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(ManagecameraformComponent, options);

    if (ev) {
      dialogRef.componentInstance.deviceid = ev.device;
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Configuration';
    }

    dialogRef.closed.subscribe((val: any) => {
      this.getCameralisting(this.filters);
    });
  }

  getCameralisting(filters: any) {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.loading = false;
      this.count = resp.data['count'];
      this.CameraListingData = resp.data['data'];
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  onDeallocateCamera(ev: any) {
    AlertService.confirm('Are you sure?', 'You want to de-allocate camera', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.loading = true;
        const slug = `${environment.baseUrlDevice}/api/device?device_id=${ev.device}`;
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.loading = false;
          this.getCameralisting(this.filters);
        }, (err: any) => {
          this.loading = false;
          this.toastr.error(err.error['message']);
        });
      } else {
        return;
      }
    })
  }


  onDelete(ev?: any, cod?: number) {
    ev.item = ev.camera_name;
    ev.status = ev.status;
    ev.delete = false;
    ev.inactive = false;
    ev.cancel = false;
    if (cod == 1) {
      ev.inactive = true;
    } else {
      ev.delete = true;
    }
    ev.cancel = true;
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      // dialogRef.componentInstance.title = 'Edit User';
    }

    dialogRef.closed.subscribe((result) => {
      if (result === 1) {
        this.confirmDelete(ev.id);
      } else if (result === 2) {
        console.log("ev:", ev)
        this.inactiveUser(ev, ev.id);
      }
    });

  }

  confirmDelete(param) {
    this.userservice.deleteCameraListing(param, this.urlPort.userMS).subscribe((apiResponse: any) => {
      this.toastr.success(apiResponse.message)
      this.getCameralisting(this.filterCamera)
    }, err => {
      this.toastr.error(err.error.message);
    })
  }

  inactiveUser(param, id) {
    let params = {}
    // params['id'] = param.id;
    params['status'] = param.status == 'Active' ? 'InActive' : 'Active';
    this.userservice.patchCameraListing(params, id, this.urlPort.userMS).subscribe((apiResponse: any) => {
      this.toastr.success('Record Updated Successfully')
      this.getCameralisting(this.filterCamera)
    }, (err: any) => {
      this.toastr.error(err.error.message);
    })
  }

  onFilterSignals(ev: any) {
    for (const key in ev) {
      if (!!ev[key]) {
        this.filters[key] = ev[key];
      }
    }
  }

  onReset() {
    this.actions.next({ type: 'reset' });
    setTimeout(() => {
      this.filters = { limit: 10, offset: '0', customer_id: this.customerId, device_type: 'camera' };
      this.getCameralisting(this.filters);
    }, 300);
  }

  showList() {
    this.getCameralisting(this.filters);
  }
}
