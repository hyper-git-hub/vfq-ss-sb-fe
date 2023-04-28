import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { TableConfig } from 'src/app/shared/general-table/model';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { BuildingService } from 'src/app/core/services/building.service';
import { environment, ports } from 'src/environments/environment';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';
import { ApiService } from 'src/app/services/api.service';

import { ManagebuildingformComponent } from '../managebuildingform/managebuildingform.component';
import { BuildingTableConfig } from './config'
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {

  count: number;
  type: any;

  urlPort = ports;
  building: any[] = [];
  buildings: any[];
  buildingData: any[];

  config: TableConfig;
  actions: Subject<any> = new Subject();
  filtersForm: FormGroup;

  filteredURL: any;
  readonly: boolean;
  buildingFilters: any;
  activeInactiveData: any;

  constructor(
    private dialog: NgbModal,
    private buildingService: BuildingService,
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService,
    public formBuilder: FormBuilder,
  ) {

    this.filtersForm = this.formBuilder.group({
      type: [null],
      building: [null],
    })
    this.type = [
      { id: 1, name: 'Commercial Building' },
      { id: 2, name: 'Residental building' },
      { id: 3, name: 'Educational Building' },
      { id: 4, name: 'Hospital building' },
      { id: 5, name: 'Stadium' },
      { id: 5, name: 'Other' },
    ];

    const user: any = JSON.parse(localStorage.getItem('user'));
    let per: any = JSON.parse(localStorage.getItem('permission'));
    this.readonly = per ? false : true;

    this.config = new TableConfig(BuildingTableConfig.config);
    this.filteredURL = { limit: 10, offset: '0', order: '', order_by: '', search_text: '' };
    this.buildingFilters = { limit: 10, offset: '0', order: '', order_by: '', search: '', type: '', id: '' };
  }

  ngOnInit(): void {
    this.config = new TableConfig(BuildingTableConfig.config);
    this.getBuildings(this.buildingFilters);
  }

  onTableSignals(ev: any) {
    // console.log(ev)
    if (ev.type === 'onData') {
      this.makeBuildingData(ev);
    } else if (ev.type === 'onEdit') {
      this.onAddbuilding(ev.row);
    } else if (ev.type === 'onDelete') {
      // this.onDelete(ev.row);
    } else if (ev.type === "onSetting") {
      this.onInactive(ev.row);
    } else if (ev.type === "onBuildingId") {
      this.router.navigate(['/ss/manage-building/building-detail', ev.row['id']]);
    } else if (ev.type === 'onPagination') {
      this.buildingFilters.limit = ev.data['limit'];
      this.buildingFilters.offset = ev.data['offset'];
      this.getBuildings(this.buildingFilters);
    } else if (ev.type === 'onSorting') {
      this.buildingFilters.order = ev.data['direction'];
      this.buildingFilters.order_by = ev.data['column'];
      this.getBuildings(this.buildingFilters);
    } else if (ev.type === 'searchTable') {
      this.buildingFilters.search = ev.data;
      this.getBuildings(this.buildingFilters);
    }
  }

  onAddbuilding(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true, backdrop: 'static', keyboard: false };
    const dialogRef = this.dialog.open(ManagebuildingformComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Building';
    }

    dialogRef.closed.subscribe(() => {
      this.getBuildings(this.buildingFilters)
    });
  }

  makeBuildingData(resp?: any) {
    if (resp.data['data'] && resp.data['data'].length > 0) {
      resp.data['data'].forEach(item => {

        let typeName = this.type.filter(i => {
          return i.id == item.type
        })

        if (typeName && typeName.length > 0) {
          item.type = typeName[0].name
        }

        // const address = item.attributes.filter(ele => {
        //   return ele.name == "Address"
        // })

        // if (address && address.length > 0) {
        //   item.address = address[0].value
        // }

        item.floor = item.floors.length;

      })
    }
    this.buildings = resp.data['data'];
    this.count = resp.data['count'];
  }

  // atm unused functions
  onInactive(ev?: any) {
    ev.item = ev.name;
    // ev.status = ev.status == '1' ? '2' : '1';
    this.activeInactiveData = ev;
    ev.inactive = true;
    ev.cancel = true;
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      // dialogRef.componentInstance.title = 'Edit User';
    }

    dialogRef.closed.subscribe((result) => {
      if (result === 2) {
        this.inactiveBuilding(ev, ev.id);
      }
    });
  }

  inactiveBuilding(param, id) {
    let params = param;
    params['type'] = param.type =='Commercial Building' ? '1' : param.type =='Residental building' ? '2' : param.type =='Educational Building' ? '3' : param.type =='Hospital building' ? '4' : param.type =='Stadium' ? '5' : '6' ;
    // params['name'] = param.name;
    params['status'] = param.status == '1' ? '2' : '1';
    this.buildingService.editbuilding(params, id, this.urlPort.smartBuilding).subscribe((apiResponse: any) => {
      this.toastr.success('Record Updated Successfully');
      this.getBuildings(this.buildingFilters)
    }, err => {
      this.toastr.error(err.error.message);
    })
  }

  buildingTypeChange(event: any) {
    this.buildingFilters.type = event;
    this.buildingFilters.id = null;
    this.filtersForm.get('building')?.setValue(null);
    this.getBuildings(this.buildingFilters)
  }


  buildingChange(event) {
    if (event) {
      console.log(event);
      const dt = this.buildingData.filter(ele => {
        return ele.id === event;
      });
      this.setBuildingListData(dt);
      this.count = dt.length;
      this.buildingFilters.id = event;
      this.getBuildings(this.buildingFilters)
    } else {
      this.getBuildings(this.buildingFilters);
    }
  }

  getBuildings(buildingFilters: any) {
    console.log(buildingFilters)
    this.actions.next({action: 'loadingTrue'});
    this.actions.next({action: 'filter'});
    this.buildingData = []
    let url = new URL(`${environment.baseUrlSB}/building/`);
    for (const key in buildingFilters) {
      if (!!buildingFilters[key]) {
        url.searchParams.set(key, buildingFilters[key]);
      }
    }
    
    this.apiService.get(url.href).subscribe((resp: any) => {
      this.actions.next({action: 'loadingFalse'});
      this.buildingData = resp.data['data'];
      this.setBuildingListData(resp.data['data']);
      this.count = resp.data['count'];
    }, (err: any) => {
      this.actions.next({action: 'loadingFalse'});
      // this.loading = false;
    });
  }

  setBuildingListData(resp: any) {
    resp.forEach(item => {
      let typeName = this.type.filter(i => {
        return i.id == item.type
      })

      if (typeName && typeName.length > 0) {
        item.type = typeName[0].name
      }

      const address = item.attributes.filter(ele => {
        return ele.name == "Address"
      })

      if (address && address.length > 0) {
        item.address = address[0].value
      }

      item.floor = item.floors.length;
    });
    this.buildings = resp;
  }

  onReset() {
    this.filtersForm.reset();
    this.actions.next({action: 'reset-search'});
    this.buildingFilters = { limit: 10, offset: '0', order: '', order_by: '', search_text: '', type: '', id: '' };
    this.getBuildings(this.buildingFilters)
  }
}
