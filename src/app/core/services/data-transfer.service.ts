import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  public data: any;
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();


  public sidebarData: any;
  @Output() updatedSidebarData: EventEmitter<any> = new EventEmitter();


  private configurationData: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() { }


  setData(data) {
    this.data = data;
    this.dataUpdated.emit(data);
  }

  getData() {
    return this.data;
  }

  setSidebarData(data) {
    this.sidebarData = data;
    this.updatedSidebarData.emit(data);
  }

  getSidebarData() {
    return this.sidebarData;
  }





  //////// store Configuration Data ////////
  setConfigurationData(data: any): void {
    this.configurationData.next(data);
  }

  getConfigurationData(): Observable<any> {
    return this.configurationData;
  }

}
