import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { livefeedTableConfig } from './livefeedform-config';
import { TableConfig } from 'src/app/shared/general-table/model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-livefeedform',
  templateUrl: './livefeedform.component.html',
  styleUrls: ['./livefeedform.component.scss']
})
export class LivefeedformComponent implements OnInit {
  listData: any[];
  title: any;
  loading: boolean;
  bySec: any[] = []
  livefeedTableConfig: TableConfig;
  actions: Subject<any> = new Subject();
  livefeedListingData: any[];
  catagory: any
  viewList: any[] = []
  listLobby: any[] = [];
  listHall: any[] = [];
  listRoom: any[] = [];
  cameraList: any[] = []
  cameraName: any


  userform: FormGroup;
  editView: FormGroup




constructor(private modalRef: NgbActiveModal) {

  this.bySec = [
    { id: '1', name: 'Lobby' },
    { id: '2', name: 'Hallway' },
    { id: '3', name: 'Room' },
  ];
  this.listLobby = [
    { id: '1', name: 'view 1' },
    { id: '2', name: 'view 2' },
    { id: '3', name: 'view 3' },
    { id: '3', name: 'view 4' },
    { id: '3', name: 'view 5' },
    { id: '3', name: 'view 6' },
  ];
  this.listHall = [
    { id: '1', name: 'view 1' },
    { id: '2', name: 'view 2' },
    { id: '3', name: 'view 3' },
    { id: '3', name: 'view 4' },
  
  ];
  this.listRoom = [
    { id: '1', name: 'view 1' },
    { id: '2', name: 'view 2' },
    { id: '3', name: 'view 3' },
  
  ];
  this.cameraList = [
    { id: '1', name: 'camera 1' },
    { id: '2', name: 'camera 2' },
    { id: '3', name: 'camera 3' },
  ];


  this.userform = new FormGroup({
    name: new FormControl(null,),
    views: new FormControl(null),
    camera: new FormControl(null),
  });
  
  this.editView = new FormGroup({
    space: new FormControl(null,),
    camera_views: new FormControl(null),
  });

  
  this.livefeedTableConfig = new TableConfig(livefeedTableConfig.config);
  this.actions.next({ action: 'loadingTrue' })

}

ngOnInit(): void {


}
onCloseModel() {
  this.modalRef.close(this.listData);
}

onDelete(row: any) {
  throw new Error('Method not implemented.');
}
onConfirm(row: any, arg1: number) {
  throw new Error('Method not implemented.');
}


onChangeView(ev: any) {
  console.log(" the Sec Area == ", ev)

}
onChangeCam(ev: any) {
  console.log("The Changes of Camera ==> ", ev)

}
onSubmit() {
  console.log( "this.catagory == > ", this.catagory )
  if(this.catagory==='edit')
  console.log(" the val", this.editView.value)
  else if( this.catagory === 'add'){
    console.log(" the val", this.userform.value)
  }
  else{
    console.log( "error" )
  }
}

deleteRow(x){
  // var delBtn = confirm(" Do you want to delete ?");
  // if ( delBtn == true ) {
  this.viewList.splice(x, 1);
  // }   
} 

// onAreaSelect(ev: any) {
//   console.log(" the Sec Area ", ev)
// }
checkSection(event: any) {
  console.log(" the event data", event)
}

onAreaSelect(ev: any) {
  console.log(" The Selected Area ", ev)
  if (ev === '1') {
    this.viewList = this.listLobby
  }
  else if (ev === '2') {
    this.viewList = this.listHall
  }
  else if (ev === '3') {
    this.viewList = this.listRoom
  }
}


}
