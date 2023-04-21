import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateUtils } from 'src/app/Utils/DateUtils';

import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-socket-schedule-form',
    templateUrl: './socket-schedule-form.component.html',
    styleUrls: ['./socket-schedule-form.component.scss']
})
export class SocketScheduleFormComponent implements OnInit {
    loading: boolean;
    title: string;
    data: any;
    
    start_date: any[] = [];
    days: any[] = [];
    device_children_id: any[] = [];

    deviceId: any;
    customerId: any;

    scheduleForm: FormGroup;

    constructor(
        private modalRef: NgbActiveModal,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private apiService: ApiService,
    ) {
        this.loading = false;
        this.deviceId = null;
        this.customerId = null;
        this.data = null;
        this.title = 'Add New Schedule';

        this.scheduleForm = this.formBuilder.group({
            id: [null],
            state: [true, [Validators.required]],
            schedule_name: [null, [Validators.required]],
            start_time: [null, [Validators.required]],
            end_time: [null, [Validators.required]],
            repeat: [false],
            start_date: [null],
            device_children_id: [null],
            device_configuration: [null],
        });
    }

    ngOnInit(): void {
        this.start_date = [
            { id: 0, value: 0, name: 'Monday', select: false },
            { id: 1, value: 1, name: 'Tuesday', select: false },
            { id: 2, value: 2, name: 'Wednesday', select: false },
            { id: 3, value: 3, name: 'Thursday', select: false },
            { id: 4, value: 4, name: 'Friday', select: false },
            { id: 5, value: 5, name: 'Saturday', select: false },
            { id: 6, value: 6, name: 'Sunday', select: false },
        ]

        if (this.data) {
            this.getScheduleDetails(this.data.device);
            // this.scheduleForm.patchValue(this.data);
        }
    }

    getScheduleDetails(id: any) {
        this.loading = true;
        const slug = `${environment.baseUrlDevice}/api/schedule-task/?device_id=${id}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            const dt = resp.data['data'][0];
            if (!!dt) {
                this.start_date.forEach(ele => {
                    dt.start_date.forEach(st => {
                        if (ele.id === st) {
                            ele.select = true;
                            this.onSelectDay(ele);
                        }
                    });
                });
            }
            dt.start_time = DateUtils.getLocalTime(dt.start_time);
            dt.end_time = DateUtils.getLocalTime(dt.end_time);
            this.loading = false;
            this.scheduleForm.patchValue(dt);
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error getting schedule details');
        });
    }

    onSubmit() {
        this.loading = true;
        const formData = this.scheduleForm.value;
        
        if (this.scheduleForm.invalid) {
            return;
        }
        
        let slug = `${environment.baseUrlDevice}/api/schedule-task`;
        let devConfig = { action: formData.state ? 'turnOnSocket' : 'turnOffSocket', payload: { "power": formData.state ? '1' : '0' } };
        let payload: any = {
            device_id: this.deviceId,
            schedule_name: formData.schedule_name,
            start_date: this.days,
            // start_time: formData.start_time,
            // end_time: formData.end_time,
            start_time: DateUtils.getUTCTime(formData.start_time),
            end_time: DateUtils.getUTCTime(formData.end_time),
            repeat: formData.repeat,
            state: formData.state,
            device_children_id: [],
            device_configuration: devConfig,
        };

        if (this.data) {
            slug = `${environment.baseUrlDevice}/api/schedule-task?schedule_id=${this.data.schedule_id}`
            this.updateSchedule(slug, payload);
            console.log(formData)
        } else {
            console.log(formData)
            this.createSchedule(slug, payload);
        }
    }

    createSchedule(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastr.success(resp.message);
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastr.error(err.error.message);
            this.loading = false;
            this.modalRef.close();
            // this.loading = false;
        });
    }

    updateSchedule(slug: string, payload: any) {
        payload.schedule_id = this.data.schedule_id;
        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastr.success("Record updated successfully");
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error.message);
        });
    }

    onSelectDay(item: any) {
        if (item.select) {
            this.days.push(item.value);
        } else {
            const idx = this.days.findIndex(ele => ele === item.value);
            if (idx !== -1) {
                this.days.splice(idx, 1)
            }
        }
    }

    onCloseModel() {
        this.modalRef.close();
    }

}
