import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { STATUS, userFormConfig, UserTableConfig } from './config';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserformComponent } from '../userform/userform.component';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { environment, ports } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TableConfig } from 'src/app/shared/general-table/model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { UserBulkUploadComponent } from '../user-bulk-upload/user-bulk-upload.component';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { DateUtils } from 'src/app/Utils/DateUtils';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    breadCrumbs: any[];
    loading: boolean;
    searchForm: FormGroup;
    formConfig: FormConfig;

    config: TableConfig;
    actions: Subject<any> = new Subject();
    selection = new SelectionModel<any>(true, []);
    consumers: any[];
    data: any[];
    count: number;
    selectedIDToDelete: any[] = [];
    closeResult = '';
    user: any;
    customerid: any;
    userlisting;//: any[];
    urlPort = ports;
    selectedUsers: any[];
    filterUser: any = { limit: 10, offset: 0, order_by: '', order: '', search: '', access_type: '', status: '', created_at: '', start_date: '', end_date: '' };


    constructor(private dialog: NgbModal,
        public formBuilder: FormBuilder,
        private toastr: ToastrService,
        private apiService: ApiService,
        private authService: AuthService,
        public userservice: UserserviceService) {

        this.user = this.authService.getUser();


        this.customerid = this.user.customer.customer_id;

        this.config = new TableConfig(UserTableConfig.config);
        this.formConfig = new FormConfig(userFormConfig.config);
        this.selectedUsers = [];
        this.breadCrumbs = [
            {
                name: "User & Admin",
                url: "/ss/user-admin/users",
                icon: "ri-admin-line"
            },
            {
                name: "Users",
                url: "",
                icon: ""
            },
        ]
        this.loading = false;

    }

    ngOnInit(): void {
        this.config = new TableConfig(UserTableConfig.config);
        this.searchForm = this.formBuilder.group({
            search: ['', [Validators.required]],
        });
        this.defineFormats();
        this.getuserform(this.filterUser);
    }
    onTableSignals(ev: any) {
        console.log(ev);
        if (ev.type === 'OpenForm') {
            this.onAddUser();
        } else if (ev.type === 'onEdit') {
            this.onAddUser(ev.row);
        } else if (ev.type === 'onDelete') {
            this.onDelete(ev.row, 2);
        } else if (ev.type === 'onChangeStatus') {
            this.onChangeStatus(ev.row);
        // } else if (ev.type === 'onSetting') {
        //     this.onDelete(ev.row, 1);
        } else if (ev.type === 'selected') {
            this.selectedUsers = ev.data;
        }
        else if (ev.type === 'selected-all') {
            this.selectedUsers = ev.data;
            // this.bulkDelete(this.selectedUsers ,3);
        }
        else if (ev.type === 'searchTable') {
            this.filterUser.search = ev.data;
            this.getuserform(this.filterUser);
        }
    }

    onChangeStatus(row: any) {
        let alertMsg = row.status == 1 ? 'Mark as In-active' : 'Mark as Active';
        AlertService.warn('Are you sure?', 'What do you want to do with ' + row.first_name, alertMsg, 'Cancel').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                let payload = {
                    first_name: row.first_name, last_name: row.last_name,
                    email: row.email, phone: row.phone,
                    department: row.department, work_location: row.work_location,
                    date_joined: row.date_joined, internal_role: row.internal_role,
                    write: row.write, user_type: row.user_type,
                    status: row.status == 1 ? 2 : 1,
                    usecase_id: 5
                };

                this.userservice.patchUserListing(payload, this.urlPort.userMS).subscribe((resp: any) => {
                    this.getuserform(this.filterUser);
                }, (err: any) => {
                    this.toastr.error(err.error['message']);
                });
            } else {
                return;
            }
        });
    }

    onGeneralFormSignal2(ev: any) {
        console.log("event:", ev)
        if (ev.type === 'timeInterval') {
            this.filterUser.created_at = ev.data.value;
            if (ev.data.value != 'period') {
                this.getuserform(this.filterUser)
            }
        }
        if (ev.type === 'filterValues') {
            let dts = DateUtils.getYYYYMMDD(ev.data.start);
            this.filterUser.start_date = dts;

            let dte = DateUtils.getYYYYMMDD(ev.data.end);
            this.filterUser.end_date = dte;
            if (dts && dte) {
                this.filterUser.created_at = '';
                this.getuserform(this.filterUser)
            }
        }

    }


    // bulkDelete(selecteduser?: any,  cod?: number) {
    //     console.log("selecteduser:",selecteduser)
    //     selecteduser.delete = false;

    //     if (cod == 3) {
    //         selecteduser.delete = true;
    //     } 
    //     const options: NgbModalOptions = { size: 'md', scrollable: true };
    //     const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    //     if (selecteduser) {
    //         dialogRef.componentInstance.data = selecteduser;
    //         // dialogRef.componentInstance.title = 'Edit User';
    //     }

    //     dialogRef.closed.subscribe((result) => {
    //        console.log("result:",result);
    //         this.deleteThroughCheckbox(selecteduser);
    //     });

    // }

    deleteThroughCheckbox(selecteduser: any): any {
        console.log("evselecteduser ", selecteduser)
        this.selectedIDToDelete = [];
        if (selecteduser.selected.length > 0) {
            for (let i = 0; i < selecteduser.selected.length; i++) {
                if (selecteduser.selected[i].guid !== this.user?.guid && selecteduser.selected[i].user_type !== 1) {
                    this.selectedIDToDelete.push(selecteduser.selected[i].guid);
                }
            }
        }
        let params = {
            guid: this.selectedIDToDelete,
            usecase: 5
        }
        console.log("params ", params)
        const url = `${environment.baseUrlUser}/users/bulk-delete`
        this.apiService.patch(url, params).subscribe((data: any) => {
            selecteduser = new SelectionModel<any>(true, []);

            this.getuserform(this.filterUser);
        }, err => {
            this.toastr.error(err.error.message);
        })
    }



    onDelete(ev?: any, cod?: number) {

        ev.item = ev.first_name;
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
                this.confirmDelete(ev.email);
            } else if (result === 2) {
                this.inactiveUser(ev);
            }
        });

    }

    confirmDelete(param) {
        this.userservice.deleteUserListing(param, this.urlPort.userMS).subscribe((apiResponse: any) => {
            this.toastr.success(apiResponse.message, '', {
                // progressBar: true,
                progressAnimation: "decreasing",
                timeOut: 3000,
            })
            this.getuserform(this.filterUser);
        }, err => {
            this.toastr.error(err.error.message);
        })
    }
    inactiveUser(param) {
        console.log("param:", param)
        let params = {}
        params['email'] = param.email;
        params['status'] = param.status == 1 ? 2 : 1;
        params['write'] = param.write ? param.write : false;
        params['first_name'] = param.first_name
        params['last_name'] = param.last_name
        params['status'] = param.status == 1 ? 2 : 1;
        this.userservice.patchUserListing(params, this.urlPort.userMS).subscribe((apiResponse: any) => {
            this.toastr.success('Record Updated Successfully', '', {
                progressAnimation: "decreasing",
                timeOut: 3000,
            })
            this.getuserform(this.filterUser);
        }, err => {
            this.toastr.error(err.error.message);
        })
    }


    onAddUser(ev?: any) {
        const options: NgbModalOptions = { size: 'lg', scrollable: true };
        const dialogRef = this.dialog.open(UserformComponent, options);

        if (ev) {
            dialogRef.componentInstance.data = ev;
            dialogRef.componentInstance.title = 'Edit User';
        }

        dialogRef.closed.subscribe(() => {
            this.getuserform(this.filterUser);
        });
    }

    // onAddBulkUser(ev?: any) {
    //     const options: NgbModalOptions = { size: 'md', scrollable: true };
    //     const dialogRef = this.dialog.open(UserBulkUploadComponent, options);

    //     if (ev) {
    //         dialogRef.componentInstance.data = ev;
    //         dialogRef.componentInstance.title = 'Edit User';
    //     }

    //     dialogRef.closed.subscribe(() => {
    //         this.getuserform(this.filterUser);
    //     });
    // }


    getuserform(filter): void {
        this.loading = true;
        let params = `order=${filter.order}&order_by=${filter.order_by}&limit=${filter.limit}&offset=${filter.offset}&search=${filter.search}&created_at=${filter.created_at}&start_date=${filter.start_date}&end_date=${filter.end_date}&usecase_id=5`;
        this.userservice.getUserListing(params, this.urlPort.monolith).subscribe((resp: any) => {
            this.userlisting = resp['data'].data;
            this.count = resp.data['count'];
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error.message);
        });
    }

    onClearSearch() {
        this.searchForm.reset();
        this.filterUser.search = "";
        this.getuserform(this.filterUser);
    }

    onSearch(event: any) {
        console.log(event)
        this.filterUser.search = event.search;
        this.getuserform(this.filterUser)
    }


    defineFormats() {
        return FORMATS['status'] = STATUS;
    }

    // onSearch() {
    //     const searchValue = this.filterForm.get('search')?.value;
    //     this.actions.next({ action: 'search', row: searchValue });
    // }

    onReset() {
        this.filterUser = { limit: 10, offset: 0, order_by: '', order: '', created_at: '', start_date: '', end_date: '', search: '' };
        this.actions.next({ type: 'onReset' });
        this.getuserform(this.filterUser);
    }


}
