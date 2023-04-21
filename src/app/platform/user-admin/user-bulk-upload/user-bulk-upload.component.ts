import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-bulk-upload',
  templateUrl: './user-bulk-upload.component.html',
  styleUrls: ['./user-bulk-upload.component.scss']
})
export class UserBulkUploadComponent implements OnInit {

  bulkUploadForm: FormGroup;
  csvFiles: AbstractControl;
  selectedFileName = '';
  bulkUploadApiResponse: any;
  notCSVExcel = false;
  rejectedUsersList: any[] = [];
  disableButton: boolean = true;
  selectedFile: any;
  count: number;
  loading: boolean;
  userlisting;//: any[];
  filterUser = { limit: 10, offset: 0, order_by: '', order: '', search: '', access_type: '', status: '' };
  @ViewChild('closeFormBulk') public closeFormBulk: any;

  constructor(public formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalRef: NgbActiveModal,
    private toastr: ToastrService, ) {
    this.selectedFile = new Object();
    this.bulkUploadForm = this.formBuilder.group({
      'csvFiles': [null, [Validators.required]],
    })
    this.csvFiles = this.bulkUploadForm.controls['csvFiles'];
  }

  ngOnInit(): void {
    this.getuserform(this.filterUser)
  }



  getuserform(filters: any) {
    this.loading = true;
    this.userlisting = [];
    let params = `limit=${filters.limit}&offset=${filters.offset}&order=${filters.order}&order_by=${filters.order_by}&search=${filters.search}&usecase_id=5`;
    const url = `${environment.baseUrlUser}/users/user-listing?${params}`
    this.apiService.get(url).subscribe((resp: any) => {
      this.userlisting = resp['data'].data;
      this.count = resp.data['count'];
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err['error'].message)
    });
  }

  bulkUploadSubmit(formValue: any) {
    const params: FormData = new FormData();
    if ((formValue['csvFiles']) != null && (formValue['csvFiles']) != undefined) {
      params.append('source_file', this.selectedFile);
    }
    params.append('usecase_id', '5')
    console.log("params==== ", this.selectedFile, params)
    const url = `${environment.baseUrlUser}/users/bulk-upload`;

    this.apiService.post(url, params).subscribe((data: any) => {
      console.log("bulk upload API RESPONSE== ", data)
      this.bulkUploadApiResponse = data.data[0];
      if (data.data[0].rejected_users.length > 0) {
        this.rejectedUsersList = data.data[0].rejected_users;
        if (data.data[0].created_users.length >= 1) {
          this.getuserform(this.filterUser);
        }
      } else {
        this.closeFormBulk.nativeElement.click();
        this.toastr.success("File uploaded successfully");
        this.getuserform(this.filterUser);
        this.clear();
        this.bulkUploadForm.reset();
        this.rejectedUsersList = [];
      }
    }, (err: any) => {
      this.toastr.error(err.error.message);
    })
  }

  fileChanges(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.selectedFile = file;

      if (this.selectedFile.type.indexOf('.sheet') != -1 || this.selectedFile.type.indexOf('.ms-excel') != -1) { //|| this.selectedFile.type.indexOf('.ms-excel') != -1 //xlsx, xls
        this.notCSVExcel = false;
        this.disableButton = false;
      } else {
        this.notCSVExcel = true;
        this.disableButton = true;
      }
      this.selectedFileName = this.selectedFile.name;
    }
  }
  downloadRejectedUser() {
    if (this.bulkUploadApiResponse && this.bulkUploadApiResponse.file_url) {
      window.open(this.bulkUploadApiResponse.file_url, '_blank');
    }
  }

  clear() {
    this.bulkUploadForm.reset();
    this.selectedFileName = '';
    this.notCSVExcel = false;
    this.selectedFile = null;
    this.disableButton = true;
    this.rejectedUsersList = [];
    this.bulkUploadApiResponse = null;
  }

  onCloseModel() {
    this.modalRef.close();
  }

}
