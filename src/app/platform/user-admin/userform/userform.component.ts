import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'src/app/core/custom.validator';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { environment, ports } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent implements OnInit {

  userform: FormGroup;
  model: NgbDateStruct;
  errorMessages: string[];
  submitted: boolean;
  selectedImage: any;
  imageToSend!: File;
  loggedInUser;
  userlisting;//: any[];
  urlPort = ports;
  selectedUser: any = null;
  filterUser = { limit: 10, offset: 0, order_by: '', order: '', search: '', access_type: '' };
  userlistingLength = 0;
  imageLoading: boolean;
  data: any;
  cod: number;
  title: string;
  public avatar: File = null;
  public avatar_url: string = null;
  imageRemoved: boolean = false;
  showAlert = true;
  myInputVariable: any;
  notImage = false;
  image: any;
  selectedCountry = '+92';
  dynamicMask = "9999999999";
  countryCode = [
    { code: '+92', name: 'Pakistan' },
    { code: '+974', name: 'Qatar' }
  ]
  
  constructor(
    private modalRef: NgbActiveModal,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    //when Add button is click
    this.data = null;
    this.title = 'Add User';
    //

    this.userform = this.formBuilder.group({
      first_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
      email: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      country_code: new FormControl(974),
      phone: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.phoneOnly]),
      date_joined: [null],
      department: [null],
      internal_role: [null,],
      work_location: [null],
      write: [false],
      user_picture: new FormControl(null, [Validators.required]),
      status: new FormControl(1),
    });
  }



  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    //when Edit button click
    if (this.data) {
      // console.log(this.data)
      let dt = this.data['date_joined'].split('-');
      let day = dt[2].split('T');
      let date = { year: +dt[0], month: +dt[1], day: +day[0] };
      // console.log(date)
      this.data.status = this.data.status === 1 ? '1' : '2';
      this.userform.patchValue(this.data);
      this.userform.get('date_joined')?.setValue(date);
      this.selectedImage = this.data.image;
      this.imageToSend = this.data.image;
      this.userform.get('user_picture')?.setValue(this.selectedImage);
      if (this.data.phone) {
        let ph = this.data.phone;
        let pho = ph.toString();
        this.userform.get('phone')?.setValue(pho.replace('974', ''));
      }

    }
  }

  onSubmit() {
    const formData = this.userform.value;
    this.submitted = true;
    if (!this.userform.valid) {
      // if (this.userForm.value['user_picture'] == null) {
      //     this.userForm.controls['user_picture'].setErrors({ 'incorrect': true });
      // }
      return;
    }
    let slug = `${environment.baseUrlUser}/users/user-listing`;
    let date = null;
    if (formData.date_joined) {
      date = formData.date_joined.year + '-' + formData.date_joined.month + '-' + formData.date_joined.day;
    }
    let payload: any = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.country_code + formData.phone,
      status: formData.status,
      department: formData.department,
      work_location: formData.work_location,
      date_joined: date,
      internal_role: formData.internal_role,
      write: formData.write,
      image: formData.user_picture,
      user_type: formData['user_type'] = 2,
      usecase_id: formData['usecase_id'] = 5
    };
    if (!payload.date_joined) {
      delete payload.date_joined;
    }
    delete payload.status;


    if (this.data && this.data) {
      let doc = payload.image;
      if (doc == null || (typeof (doc) === 'string' && doc.includes('https'))) {
        delete payload.image;
      }
    }

    let d = this.convertToFormData(payload);

    // this.loading = true;
    if (this.data) {
      slug = `${environment.baseUrlUser}/users/user-profile/info`
      this.patchuserform(slug, d);
    } else {

      this.postuserform(slug, d);
    }
  }

  convertToFormData(formData: any) {
    let f = new FormData();
    var form_data = new FormData();
    for (var key in formData) {
      form_data.append(key, formData[key]);
    }
    return form_data;
  }

  patchuserform(slug, payload: any) {
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success("Record updated successfully");
      this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  postuserform(slug, payload: any): void {
    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.submitted = false;
      this.toastr.success(resp.message);
      this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  onCloseModel() {
    this.modalRef.close();
  }

  chooseImage() {
    document.getElementById('fileInput')?.click();
  }

  onImageChanged(event: any) {
    this.imageLoading = true;

    if (event.target.files.length > 0) {
      var selectedFile: File;
      selectedFile = event.target.files[0];

      if (selectedFile.type.indexOf('image') === -1) {
        this.notImage = true;
        this.selectedImage = null;
        this.imageLoading = false;
        this.userform.get('user_picture')?.setValue(null)
      } else {
        this.notImage = false;
        this.imageToSend = event.target.files[0];
        this.userform.get('user_picture')?.setValue(selectedFile);
        this.readImageURL(event.target);
      }
    }
  }

  readImageURL(input: any) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e?.target['result']
      }
      this.imageLoading = false;
      reader.readAsDataURL(input.files[0]);
    }
  }

}
