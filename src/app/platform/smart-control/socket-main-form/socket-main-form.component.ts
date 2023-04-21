import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-socket-main-form',
  templateUrl: './socket-main-form.component.html',
  styleUrls: ['./socket-main-form.component.scss']
})
export class SocketMainFormComponent implements OnInit {

  
  socketform: FormGroup;
  building: any[] = [];
  area: any[] = [];
  floor: any[] = [];
  space: any[] = [];
  room: any[] = [];
  data: any;
  title: string;

  constructor(private modalRef: NgbActiveModal,
    public formBuilder: FormBuilder,
    private dialog: NgbModal,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService) {

    this.socketform = this.formBuilder.group({
      device_name: new FormControl(null),
      building: new FormControl(null,),
      open_area: new FormControl(null),
      floor: new FormControl(null),
      space: [null],
      room: [null],

    });
  }

  ngOnInit(): void {
  }


  onSubmit() {
    //   const formData = this.userform.value;
    // this.submitted = true;
    // if (!this.userform.valid) {
    //   // if (this.userForm.value['user_picture'] == null) {
    //   //     this.userForm.controls['user_picture'].setErrors({ 'incorrect': true });
    //   // }
    //   return;
    // }
    // // let slug = `${environment.baseUrlUser}/users/user-listing`;
    // const date = formData.date_joined.year + '-' + formData.date_joined.month + '-' + formData.date_joined.day;
    // let payload: any = {
    //   first_name: formData.first_name,
    //   last_name: formData.last_name,
    //   email: formData.email,
    //   phone: formData.country_code + formData.phone,
    //   status: formData.status,
    //   department: formData.department,
    //   work_location: formData.work_location,
    //   date_joined: date,
    //   internal_role: formData.internal_role,
    //   write: formData.write,
    //   image: formData.user_picture,
    //   user_type: formData['user_type'] = 2,
    //   usecase_id: formData['usecase_id'] = 5
    // };
    // delete payload.status;


    // if (this.data && this.data) {
    //   let doc = payload.image;
    //   if (doc == null || (typeof (doc) === 'string' && doc.includes('https'))) {
    //     delete payload.image;
    //   }
    // }


    // // this.loading = true;
    // if (this.data) {
    //   slug = `${environment.baseUrlUser}/users/user-profile/info`
    //   this.patchuserform(slug, d);
    // } else {

    //   this.postuserform(slug, d);
    // }
  }


  
  onCloseModel() {
    this.modalRef.close();
  }

}
