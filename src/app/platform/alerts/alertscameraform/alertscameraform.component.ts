import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-alertscameraform',
  templateUrl: './alertscameraform.component.html',
  styleUrls: ['./alertscameraform.component.scss']
})
export class AlertscameraformComponent implements OnInit {

  alertscameraForm: FormGroup;
  formTitle = 'Alerts';
  alert_type: any[] = [];
  camera: any[] = [];

  constructor( private modalRef: NgbActiveModal,public formBuilder: FormBuilder) { }

  ngOnInit(): void {
     this.alertscameraForm = this.formBuilder.group({
    id: [null],
    alert_type: ['', [Validators.required]],
    camera: ['', [Validators.required]],
   

  });

  this.alert_type = [
    {id: 1, name: 'Occupancy'},
    {id: 2, name: 'Geozone'},
  ];
  this.camera = [
    {id: 1, name: 'Camera 1'},
    {id: 2, name: 'Camera 2'},
    {id: 3, name: 'Camera 3'},
    {id: 4, name: 'Camera 4'},
  ];

  }

  onSubmit(value)
  {

  }

  onCloseModel() {
    this.modalRef.close();
}

}
