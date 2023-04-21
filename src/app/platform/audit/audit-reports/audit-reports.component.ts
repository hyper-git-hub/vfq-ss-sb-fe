import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig } from 'src/app/shared/general-table/model';
import { auditTableConfig } from './config';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audit-reports',
  templateUrl: './audit-reports.component.html',
  styleUrls: ['./audit-reports.component.scss']
})
export class AuditReportsComponent implements OnInit {

  loading: boolean;
  count: number;

  breadCrumbs: any[];
  types: any[];
  auditActions: any[];
  auditActionsArray: any[];
  auditList: any[];

  auditFilter: any;
  user: any;
  customerId: any;

  actions: Subject<any>;
  auditTableConfig: TableConfig;
  filterForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {
    this.loading = false;
    this.count = 0;

    this.breadCrumbs = [
      {
        name: "Audit",
        url: "/ss/audit",
        icon: "ri-focus-3-line"
      },
      {
        name: "Report",
        url: "",
        icon: ""
      },
    ];
    this.types = [];
    this.auditActions = [{ id: 1, name: 'Create' }, { id: 2, name: 'Update' }, { id: 3, name: 'Delete' }];
    this.auditList = [];

    this.auditFilter = { limit: 10, offset: '0', use_case_id: 5, order_by: '', order: '', audit_type: 'building', action: '1', export: '' };
    this.auditTableConfig = new TableConfig(auditTableConfig.config);
    this.actions = new Subject();
    this.filterForm = new FormGroup({
      type: new FormControl(null),
      action: new FormControl(null),
    });

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];
  }

  ngOnInit(): void {
    this.getAuditTypes();
    this.getAudits(this.auditFilter)
  }

  getAuditTypes() {
    const slug = `${environment.baseUrlAudit}/api/audit/type?use_case_id=5`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.types = resp.data;
    });
  }

  getAudits(filters: any) {
    console.log("filters:",filters)
    this.loading = true;
    this.auditTableConfig.slug = `${environment.baseUrlAudit}/api/audit?use_case_id=5&audit_type=${filters.audit_type}&action=${1}&`
    if (this.auditTableConfig.slug) {
      this.actions.next({ action: 'filter' });
    }
    let url = new URL(`${environment.baseUrlAudit}/api/audit`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.auditList = resp.data['data'];
      this.count = resp.data['count'];
      this.loading = false;

    }, (err: any) => {
      this.toastr.error(err.error['message']);
      this.loading = false;
    });
  }

  onTableSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'onDetails') {
      console.log('company cell clicked');
    } else if (ev.type === 'onSorting') {
      this.auditFilter.order = ev.data['direction'];
      this.auditFilter.order_by = ev.data['column'];
      this.getAudits(this.auditFilter);
    } else if (ev.type === 'onPagination') {
      this.auditFilter.limit = ev.data['limit'];
      this.auditFilter.offset = ev.data['offset'];
      this.getAudits(this.auditFilter);
    }
  }

  generateAudit() {
    const formData = this.filterForm.value;
    this.auditFilter.audit_type = formData.type;
    this.auditFilter.action = formData.action;
    this.getAudits(this.auditFilter);
  }


  checkbuilding(event) {
    if (event == 'building') {
      let idx = this.auditActions.findIndex(ele => {
        return ele.name === 'Delete';
      });
      this.auditActions.splice(idx, 1);
    }
    else {
      this.auditActions = [{ id: 1, name: 'Create' }, { id: 2, name: 'Update' }, { id: 3, name: 'Delete' }];
    }
  }

  onReset() {
    this.filterForm.reset();
    this.auditFilter.action = '';
    this.auditFilter.audit_type = '';
    this.getAudits(this.auditFilter);
  }
}
