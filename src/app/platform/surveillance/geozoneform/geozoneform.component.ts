import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ports } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-geozoneform',
  templateUrl: './geozoneform.component.html',
  styleUrls: ['./geozoneform.component.scss']
})
export class GeozoneformComponent implements OnInit {

  geozoneForm: FormGroup;
  formTitle = 'Geozone';
  building: any[] = [];
  camera: any[] = [];
  urlPort = ports;
  data: any;
  title: string;
  submitted: boolean;

  constructor(private modalRef: NgbActiveModal,public formBuilder: FormBuilder,
    private toastr: ToastrService) {

       //when Add button is click
    this.data = null;
    this.title = 'Add Geozone';
    //
     }

  ngOnInit(): void {
    this.geozoneForm = this.formBuilder.group({
      id: [null],
      buildings: [null ],
      cameras: [null],
      playBackTimeInterval: [null ],
    });

    this.building = [
      {id: 1, name: 'Building 1'},
      {id: 2, name: 'Building 2'},
    ];
    this.camera = [
      {id: 1, name: 'Camera 1'},
      {id: 2, name: 'Camera 2'},
      {id: 3, name: 'Camera 3'},
      {id: 4, name: 'Camera 4'},
    ];
  }

  


  onCloseModel() {
    this.modalRef.close();
}

postGeozone(formValue): void {
  // this.geozoneservice.addGeozone(formValue, this.urlPort.userMS).subscribe((data: any) => {
  //   this.submitted = false;
  //   this.toastr.success(data.message);
  //   this.modalRef.close();
  // }, err => {
  //   this.toastr.error(err.error.message);
  //   // this.btnText = "Save";
  //   // this.btnLoading = false;
  // })
}

onSubmit(formValue) {
  console.log("form:",formValue);
  this.submitted = true;


    if (this.geozoneForm.invalid) {
      return;
    }
    // const param: FormData = new FormData();
    // const id = this.userform.getRawValue().id;
    // let dt = formValue['date_joined'];
    // let date = `${dt.year}-${dt.month}-${dt.day}`;
    // // console.log(date);
    // formValue['username'];
    // formValue['email'];
 
    // formValue['date_joined'] = date;
    // formValue['user_type'] = 2;
    // formValue['write'] = formValue.write ? formValue.write : false;
    // formValue['usecase_id'] = 2;

    // formValue['guid'] = this.loggedInUser?.guid;
    // formValue['user_guid'];
   
  
    
      if (this.data && this.data.email) {
        // this.patchGeozone(formValue);
      } else {
        this.postGeozone(formValue);
      }
  

}

}
