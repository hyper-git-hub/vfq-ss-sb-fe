import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/app/shared/general-table/model';
import { geozoneTableConfig } from './config';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GeozoneformComponent } from '../geozoneform/geozoneform.component';
import { environment, ports } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-geozone',
  templateUrl: './geozone.component.html',
  styleUrls: ['./geozone.component.scss']
})
export class GeozoneComponent implements OnInit {

  searchForm: FormGroup
  geozoneform: FormGroup;
  formTitle = 'Geo Zone';
  model: NgbDateStruct;
  closeResult = '';
  config: TableConfig;
  actions: Subject<any> = new Subject();
  consumers: any[];
  count: number;
  dataSource: any = [];
  urlPort = ports;
  geozoneListingData: any[] = [];
  customerId: any;
  geozoneFilters: any;


  constructor(
    public formBuilder: FormBuilder,
    private dialog: NgbModal,
    private apiService: ApiService,
  ) {
    this.config = new TableConfig(geozoneTableConfig.config);
    this.consumers = [
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
      { id: 1533, cameraname: 'CAM 07', buildingtype: 'Commercial', floor: '2', space: 'Halway', type: 'Geo Zone', status: 'ON' },
    ];
    this.count = this.consumers.length;

    this.searchForm = this.formBuilder.group({
      search: [null],
    });
    this.geozoneListingData = [];
    let u: any = localStorage.getItem('user');
    const user = JSON.parse(u);
    this.customerId = user.customer['customer_id'];
    this.geozoneFilters = { limit: 10, offset: '0', customer_id: this.customerId, device_type: 'Camera', geozone: 'geozone', order_by: '', order: '', search: '', device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
  

  }

  // get time() {
  //   return this.geozoneform.get('time') as FormArray;
  // }

  // addmoretime() {
  //   this.time.push(                    //for two or more
  //     this.formBuilder.group({
  //       starttime: [''],
  //       endtime: ['']
  //     })
  //   );

  //   // this.department.push(this.formBuilder.control(''));    //for one field
  // }

  // removeGroup(index) {
  //   const form = this.geozoneform.get('time') as FormArray
  //   form.removeAt(index);
  // }

  ngOnInit(): void {

    this.config = new TableConfig(geozoneTableConfig.config);
  }
  onTableSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'OpenForm') {
      this.onAddgeozone();
    } else if (ev.type === 'onEdit') {
      this.onAddNew(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDelete(ev.row);
    } else if (ev.type === 'onDetails') {
      console.log('company cell clicked');
    }
  }
  onDelete(row: any) {
    throw new Error('Method not implemented.');
  }
  onAddNew(row?: any) {
    throw new Error('Method not implemented.');
  }

  onAddgeozone(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(GeozoneformComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit GeoZone';
    }

    dialogRef.closed.subscribe(() => {
      this.actions.next({ action: 'reload' });
  });
  }

  getSocketListing(filters: any) {
    // this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      // this.loading = false;
      this.count = resp.data['count'];
      this.geozoneListingData = resp.data['data'];
    })}
  //   //  (err: any) => {
  //   //   this.toastr.error(err.error['message'], '');
  //   // });
  // }






  

  getGeoZoneListing(filter): void {
    // this.searchPlaceHolder = 'Loading...';
    // this.enableSearch = true;
    // this.showIndeterminateProgress = true;
    this.dataSource = [];
    // this.submittedTerritory = true;
  
    let params = `order=${filter.order}&order_by=${filter.order_by}&limit=${filter.limit}&offset=${filter.offset}&search=${filter.search}`;
  
    // this.downloadPdfCustomer = `${this.urlPort.monolith}/Customer/?order=${filter.order}&order_by=${filter.order_by}&limit=${filter.limit}&offset=${filter.offset}&search=${filter.search}`;
  
    // this.geozoneservice.getGeozoneListing(params, this.urlPort.monolith)
    //     .subscribe((data: any) => {
    //         // this.showIndeterminateProgress = false;
    //         // this.submittedTerritory = false;
    //         this.dataSource = data['data'].data;
    //         // this.dataSource = data['data'].count;
    //         // this.dataSource.pagination = this.dataSource
    //     });
  }


}
