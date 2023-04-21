import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TableConfig } from 'src/app/shared/general-table/model';
import { OccupancyTableConfig, GeoZoneTableConfig } from '../config';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertscameraformComponent } from '../alertscameraform/alertscameraform.component';


@Component({
  selector: 'app-alerts-cameras',
  templateUrl: './alerts-cameras.component.html',
  styleUrls: ['./alerts-cameras.component.scss']
})
export class AlertsCamerasComponent implements OnInit {

  filterForm:FormGroup; 
  model:NgbDateStruct;
  searchForm: FormGroup;
  building: any[] = [];
  floor: any[] = [];
  camera:any[] = [];

  config: TableConfig;
  actions: Subject<any> = new Subject();
  consumers: any[];
  count: number;
  active = 1;
  
  
  constructor(private dialog: NgbModal,public formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      id: [null],
      buildings: [null, [Validators.required]],
      cameras: [null, [Validators.required]],
      floors: [null, [Validators.required]],
      playBackTimeInterval: [null],
      startdate:[null],
      enddate:[null],
      search:[null],


    });
 
    this.config = new TableConfig(OccupancyTableConfig.config);
    this.consumers = [
      { id: 1, name: 'Cam 1', type: 'Commercial Building', floor: '1st Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: '	Occupied' },
      { id: 2, name: 'Cam 1', type: 'Commercial Building', floor: '2nd Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: 'Not Occupied' },
      { id: 3, name: 'Cam 1', type: 'Commercial Building', floor: '3rd Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: '	Occupied' },
      { id: 4, name: 'Cam 1', type: 'Commercial Building', floor: '4th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: 'Not Occupied' },
      { id: 5, name: 'Cam 1', type: 'Commercial Building', floor: '5th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: '	Occupied' },
      { id: 6, name: 'Cam 1', type: 'Commercial Building', floor: '6th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: '	Occupied' },
      { id: 7, name: 'Cam 1', type: 'Commercial Building', floor: '7th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: 'Not Occupied' },
      { id: 8, name: 'Cam 1', type: 'Commercial Building', floor: '8th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: 'Not Occupied' },
      { id: 9, name: 'Cam 1', type: 'Commercial Building', floor: '9th Floor', space:'Appartment', room:'Play Area', overflow:'45', underflow:'22', status: '	Occupied' },
     
  ];
  this.count = this.consumers.length;

   }

  ngOnInit(): void {
    this.config = new TableConfig(OccupancyTableConfig.config);
    this.building = [
      {id: 1, name: 'building 1'},
      {id: 2, name: 'building 2'},
   
  ];

  this.floor = [
    {id: 1, name: 'Floor 1'},
    {id: 2, name: 'Floor 2'},
  ];

  this.camera = [
    {id: 1, name: 'Camera 1'},
    {id: 2, name: 'Camera 2'},
  ];
  }
 
  onTableSignals(ev: any) {
    if (ev.type === 'OpenForm') {
        this.onAddNew();
    } else if (ev.type === 'onEdit') {
        this.onAddNew(ev.row);
    } else if (ev.type === 'onDelete') {
        this.onDelete(ev.row);
    } else if (ev.type === 'onDetails') {
    }
}
  onDelete(row: any) {
    throw new Error('Method not implemented.');
  }
  onAddNew(row?: any) {
    throw new Error('Method not implemented.');
  }

  onAddshedule(ev?: any)
  {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(AlertscameraformComponent, options);

    if (ev) {
        dialogRef.componentInstance.data = ev;
        dialogRef.componentInstance.title = 'Edit User';
    }

    dialogRef.closed.subscribe(() => {
        // this.getUsers();
    });
  }

}
