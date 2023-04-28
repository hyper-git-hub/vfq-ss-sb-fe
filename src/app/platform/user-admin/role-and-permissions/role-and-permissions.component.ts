import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig } from 'src/app/shared/general-table/model';
import { RoleTableConfig } from './config'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddGroupFormComponent } from '../add-group-form/add-group-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { environment, ports } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { AssignGroupFormComponent } from '../assign-group-form/assign-group-form.component';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';

@Component({
  selector: 'app-role-and-permissions',
  templateUrl: './role-and-permissions.component.html',
  styleUrls: ['./role-and-permissions.component.scss']
})
export class RoleAndPermissionsComponent implements OnInit {

  filterForm: FormGroup
  config: TableConfig;
  actions: Subject<any> = new Subject();
  consumers: any[];
  count: number;
  breadCrumbs: any[];
  loading: boolean;
  readonly: boolean;
  submitted: boolean = false;
  btnText: string = "Save";
  dataSource: any = [];

  urlPort = ports;
  listOfGroups = [];
  totalGroupLength = 0;
  moduleId: any;
  useCaseId: any;
  category: any;
  groupFilters = { limit: 10, offset: 0, order_by: '', order: '', search: '', export: '' };

  loggedInUser;
  loggedInUserPackageID: any;
  array1: any[] = [];
  array2: any[] = [];
  array3: any[] = [];
  array4: any[] = [];
  array5: any[] = []
  array6: any[] = [];
  array7: any[] = []
  mainArray = [];
  unAssignedUsers: any[] = [];

  constructor(
    private dialog: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userservice: UserserviceService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.config = new TableConfig(RoleTableConfig.config);

    this.filterForm = this.formBuilder.group({
      search: ['', [Validators.required]],
    });

    this.breadCrumbs = [
      {
        name: "User & Admin",
        url: "/ss/user-admin/users",
        icon: "ri-admin-line"
      },
      {
        name: "Roles & Permissions",
        url: "",
        icon: ""
      },
    ]

    this.loading = false;

  }

  ngOnInit(): void {
    this.config = new TableConfig(RoleTableConfig.config);


    this.loggedInUser = this.authService.getUser();

    const user: any = JSON.parse(localStorage.getItem('user'));
    let per: any = JSON.parse(localStorage.getItem('permission'));
    this.readonly = per ? false : true;


    this.loggedInUserPackageID = this.loggedInUser?.customer?.associations.filter(item => {
      return item.package.usecase === 5
    })[0]?.package?.package_id;

    this.getTableListing(this.groupFilters)
    this.getFeatureListing()
    this.getUnassignedUsers();
  }

  getUnassignedUsers() {
    this.userservice.getAllUsersAssignGroup(this.urlPort.monolith).subscribe((apiResponse: any) => {
      this.unAssignedUsers = apiResponse['data'];
    });
  }

  onTableSignals(ev: any) {
    if (ev.type === 'OpenForm') {
      this.onAddNew();
    } else if (ev.type === 'onEdit') {
      this.onAddGroup(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeleteGroup(ev.row);
      // this.onDelete(ev.row, 2);
    } else if (ev.type === 'onSetting') {
      this.onDelete(ev.row, 1);
    } else if (ev.type === 'onDetails') {
    } else if (ev.type === 'searchTable') {
      this.groupFilters.search = ev.data;
      this.getTableListing(this.groupFilters);
    }
  }

  onAddGroup(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(AddGroupFormComponent, options);
    if (ev) {
      ev.stations = this.mainArray;
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.unAssignedUsers = this.unAssignedUsers;
      dialogRef.componentInstance.title = 'Edit Group';
      dialogRef.componentInstance.btnText = 'Update';
    } else {
      dialogRef.componentInstance.data = this.mainArray;
      dialogRef.componentInstance.title = 'Add Group';
      dialogRef.componentInstance.btnText = 'Save';
    }

    dialogRef.closed.subscribe(() => {
      this.getTableListing(this.groupFilters);
    });
  }

  onAssignGroup(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(AssignGroupFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      // dialogRef.componentInstance.title = 'Edit Group';
    }

    dialogRef.closed.subscribe(() => {
      this.getTableListing(this.groupFilters);
    });
  }

  onDeleteGroup(row: any) {
    console.log(row);
    AlertService.confirm('Are you sure?', 'You want to delete this?', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.loading = true;
        const slug = `${environment.baseUrlRA}/api/role-and-access/group?id=${row.id}`;
    
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.getTableListing(this.groupFilters);
          this.loading = false;
        }, (err: any) => {
          this.loading = false;
          this.toastr.error(err.error['message'], 'Error deleting group');
        });
      } else {
        return;
      }
    });
  }

  getTableListing(filters) {
    this.loading = true;
    let params = `order=${filters.order}&order_by=${filters.order_by}&limit=${filters.limit}&offset=${filters.offset}&search=${filters.search}&export=${filters.export}&use_case_id=5`;
    this.userservice.getAssignGroups(params, this.urlPort.monolith).subscribe((apiResponse: any) => {
      this.dataSource = apiResponse?.data?.data;
      this.count =  apiResponse?.data.count
      this.loading = false;
    })
  }

  onDelete(ev?: any, cod?: number) {
    ev.item = ev.name;
    // console.log("item:", ev.item)
    ev.status = ev.status;
    ev.delete = false;
    ev.inactive = false;
    ev.cancel = false;
    ev.message = false;

    if (cod == 1) {
      ev.inactive = true;

    } else {
      ev.delete = true;
    }
    ev.cancel = true;
    let users = ev.group_user
    if (ev.group_user.length != 0) {
      ev.message = true;
    }
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      // console.log("EV:", ev)
      dialogRef.componentInstance.data = ev;
      // dialogRef.componentInstance.title = 'Edit User';
    }

    dialogRef.closed.subscribe((result) => {
      if (result === 1) {
        this.confirmDelete(ev.id);
      } else if (result === 2) {
        this.inactiveUser(ev);
      }
    });

  }

  confirmDelete(param) {
    // console.log("confirmDelete= ", param)
    this.userservice.deleteGroup(param, this.urlPort.monolith).subscribe((apiResponse: any) => {
      this.toastr.success(apiResponse.message, '', {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      })
      this.getTableListing(this.groupFilters);
    }, err => {
      this.toastr.error(err.error.message);

    })
  }


  inactiveUser(param) {
    // console.log("inactive param:",param)

    let dataToSendEdit = {
      "name": param.name,
      "description": param.description,
      "permission": param.permission,
      "features": param.group_feature_list,
      "id": param.id,
    }

    if (param.status == 1) {
      dataToSendEdit['status'] = 2;
    } else {
      dataToSendEdit['status'] = 1;
    }

    this.userservice.updateGroup(dataToSendEdit, this.urlPort.monolith).subscribe((response: any) => {
      this.toastr.success(response.message, '', {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      })
      this.getTableListing(this.groupFilters);
    }, err => {
      this.toastr.error(err.error.message);
    })

  }

  onAddNew(row?: any) {
    throw new Error('Method not implemented.');
  }


  getFeatureListing() {

    this.useCaseId = 5;
    this.userservice.getFeaturesAndPackages(this.useCaseId, '').subscribe((apiResponse: any) => {
      if (!apiResponse.error) {
        this.mainArray = apiResponse['data'];
      } else {
        this.toastr.error(apiResponse.message);
      }
    })
  }

}
