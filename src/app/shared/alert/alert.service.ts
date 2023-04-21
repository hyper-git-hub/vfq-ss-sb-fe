import { Injectable } from '@angular/core';
import { AlertDialogComponent } from './alert.dialog';
// import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { VAlert, VAlertAction } from './alert.model';
// import { GenericApiResponse } from './api.model';

@Injectable({
	providedIn: 'root'
})
export class AlertService
{

    private static _instance: any = null;

    private alerts: Subject<VAlert>;
    private queue: VAlert[];
    private presented: boolean;

    constructor(protected dialog: NgbModal)
    {
        console.log('Service called', AlertService._instance);
        if (AlertService._instance == null)
        {
            AlertService._instance = this;
        }

        this.alerts = new Subject<VAlert>();
        this.queue = [];
        this.presented = false;

        this.alerts.subscribe((a: VAlert) =>
        {
            this.present(a);
        });
    }

    private present(alert: VAlert): void
    {
        this.presented = true;
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            backdrop: 'static',
            backdropClass: 'alert-backdrop',
            size: 'sm'
        });
        dialogRef.componentInstance.alert = alert;

        dialogRef.closed.subscribe((result: VAlertAction) =>
        {
            this.presented = false;
            this.checkQueue();
            result?.alert?.subject?.next(result);
            result?.alert?.subject?.complete();
        });
    }

    private checkQueue(): void
    {
        if (this.queue.length === 0 || this.presented) { return; }

        this.alerts.next(this.queue.pop() as any);
    }

    private addAlert(alert: VAlert): void
    {
        this.queue.push(alert);
        this.checkQueue();
    }

    // tslint:disable-next-line: member-ordering
    public static success(title: string, message: string, action?: string, secAction?: string): Observable<VAlertAction>
    {
        const alert = new VAlert('success', title, message, action, secAction);
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    // tslint:disable-next-line: member-ordering
    public static error(title: string, message: string, action?: string, secAction?: string): Observable<VAlertAction>
    {
        const alert = new VAlert('error', title, message, action, secAction);
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    // tslint:disable-next-line: member-ordering
    // public static apiError(title: string, error: GenericApiResponse): Observable<VAlertAction>
    // {
    //     let message = error.ErrorMessage;

    //     if (message.includes('_'))
    //     {
    //         const st = message.split('\'');
    //         const part = st[1].toUpperCase().replace('_', '-');

    //         st[1] = `'${part}'`;
    //         message = st.join('');
    //     }

    //     const alert = new VAlert('error', title, message);
    //     AlertService._instance.addAlert(alert);

    //     return alert.subject.asObservable();
    // }

    // tslint:disable-next-line: member-ordering
    public static info(title: string, message: string, action?: string, secAction?: string): Observable<VAlertAction>
    {
        const alert = new VAlert('info', title, message, action, secAction);
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    // tslint:disable-next-line: member-ordering
    public static warn(title: string, message: string, action?: string, secAction?: string): Observable<VAlertAction>
    {
        const alert = new VAlert('warning', title, message, action, secAction);
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    // tslint:disable-next-line: member-ordering
    public static confirm(title: string, message: string, action?: string, secAction?: string): Observable<VAlertAction>
    {
        const alert = new VAlert('confirm', title, message, action, secAction);
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    // tslint:disable-next-line: member-ordering
    public static confirmWithInput(title: string, label?: string, required?: boolean): Observable<VAlertAction>
    {
        const alert = new VAlert('confirmWithInput', title, '', '', '', required);
        alert.placeholder = label || title;
        AlertService._instance.addAlert(alert);

        return alert.subject.asObservable();
    }

    alertAsk(heading: string, message: string, rightButton: string, leftButton: string)
    {
        let promise = new Promise((resolve, reject) =>
        {
            const dialogRef = this.dialog.open(AlertDialogComponent);
            dialogRef.componentInstance.alertData = {
                heading,
                message,
                rightButton: {
                    text: rightButton,
                    class: 'btn-red'
                },
                leftButton: {
                    text: leftButton,
                    class: 'btn-white'
                },
                type: 'ask',
            };

            dialogRef.closed.subscribe(result =>
            {
                resolve(result);
            });
        });
        return promise;
    }

    //     asyncAction().then(() => // console.log("Resolved!")
    // );

    private alertAsk2(heading: string, message: string, rightButton: string, leftButton: string): any
    {
        const dialogRef = this.dialog.open(AlertDialogComponent);
        dialogRef.componentInstance.alertData = {
            heading,
            message,
            rightButton: {
                text: rightButton,
                class: 'btn-red'
            },
            leftButton: {
                text: leftButton,
                class: 'btn-white'
            },
            type: 'ask',
        };

        dialogRef.closed.subscribe(result =>
        {
            return result;
        });
    }

    // tslint:disable-next-line: member-ordering
    public static alertError(heading: string, message: string): Promise<any>
    {
        return AlertService._instance.alert(heading, message, 'btn-red');
    }

    public alertSuccess(heading: string, message: string): Promise<any>
    {
        return this.alert(heading, message, 'btn-blue');
    }

    public alertInfo(heading: string, message: string): Promise<any>
    {
        return this.alert(heading, message, 'btn-white');
    }

    private alert(heading: string, message: string, btnClass: string): any
    {
        // let dialogRef = this.dialog.open(AlertDialogComponent, { autoFocus: false });
        // dialogRef.componentInstance.alertData = {
        //     heading: heading,
        //     message: message,
        //     rightButton: {
        //         text: '',
        //         class: ''
        //     },
        //     leftButton: {
        //         text: 'Ok',
        //         class: btnClass
        //     },
        //     type: 'error',
        // }

        let promise = new Promise((resolve, reject) =>
        {
            const dialogRef = this.dialog.open(AlertDialogComponent);
            dialogRef.componentInstance.alertData = {
                heading,
                message,
                rightButton: {
                    text: '',
                    class: 'btn-red'
                },
                leftButton: {
                    text: 'Ok',
                    class: btnClass
                },
                type: 'success',
            };

            dialogRef.closed.subscribe(result =>
            {
                resolve(result);
            });
        });
        // // console.log(promise);
        return promise;
    }
}
