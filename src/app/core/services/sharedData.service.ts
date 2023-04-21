import { array } from '@amcharts/amcharts4/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShareDataService {
    private subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    shareData(message: any) {
        this.subject.next(message);
        console.log("this.subject==== ", this.subject)
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }
}