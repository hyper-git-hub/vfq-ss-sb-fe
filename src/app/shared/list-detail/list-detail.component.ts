import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit, OnDestroy {
  deviceTurnOn: boolean;
  
  @Input() loading: boolean;
  @Input() switchButton: boolean;
  @Input() scheduleEnabled: boolean;

  @Input() deviceTitle: string;
  @Input() deviceUrl: string;
  @Input() deviceImage: string;
  
  @Input() signalRresponse: string;

  @Input() breadCrumbs: any[];
  @Input() table: any[];

  @Input() deviceDetail: any;
  @Input() deviceConfig: any;
  @Input() actions: Subject<any> = new Subject();

  @Output() signals: EventEmitter<any> = new EventEmitter();

  deviceId: any;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });
    this.deviceTurnOn = false;
    this.switchButton = false;
    this.scheduleEnabled = false;
    this.loading = false;
    this.breadCrumbs = [];

    this.deviceUrl = '';
    this.deviceImage = '/assets/images/default-device.png';
    this.table = [];
  }

  ngOnInit(): void {
    if (!!this.actions) {
      this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: any) => {
        this.handleActions(e);
      });
    }
  }

  setOnOff(ev: any) {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload: any = {
      device_id: this.deviceId,
      configuration: this.deviceConfig
    }

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.signals.emit({type: 'devStatus', data: resp});
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  onAddSchedule() {}

  handleActions(ac: any) {
    switch (ac.action) {
      case 'loadingTrue':
        this.loading = true;
        break;
      case 'loadingFalse':
        this.loading = false;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll != null) {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }

}
