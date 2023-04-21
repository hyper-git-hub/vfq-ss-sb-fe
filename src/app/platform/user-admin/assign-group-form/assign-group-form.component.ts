import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ports } from 'src/environments/environment';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { DropDownItem } from '../../../interfaces/dropdown-item';
import { convertTypeAcquisitionFromJson } from 'typescript';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/core/services/sharedData.service';

@Component({
  selector: 'app-assign-group-form',
  templateUrl: './assign-group-form.component.html',
  styleUrls: ['./assign-group-form.component.scss']
})
export class AssignGroupFormComponent implements OnInit {

  title = 'Role & Access';

  assignGroupForm: FormGroup;
  groupFilters = { limit: 10, offset: 0, order_by: '', order: '', search: '', export: '' };
  listOfUsers = [];
  dataSource: any = [];
  listOfGroups = [];
  userArray = [];
  useCaseId: any;
  user = [];
  urlPort = ports;
  mainArray = [];
  
  filterFeatures = [];
  subscription: Subscription;
  CompleteData: any[] = [];
  data: any[] = [];
  assignSubmitted: boolean = false;
  addGroupCurrentAction = 'add';

  constructor(public userservice: UserserviceService, private dataShare: ShareDataService,
    private fb: FormBuilder, private modalRef: NgbActiveModal, private toastr: ToastrService) {

    this.assignGroupForm = this.fb.group({
      user: [null, [Validators.required]],
      group: [null, [Validators.required,]],
    })


  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {

    this.getTableListing(this.groupFilters);
    this.getFeatureListing()
    // get users API for assign group dropdown
    this.userservice.getAllUsersAssignGroup(this.urlPort.monolith).subscribe((apiResponse: any) => {
      this.listOfUsers = apiResponse['data'];

    })
  }


  onCloseModel() {
    this.modalRef.close();
  }

  getTableListing(filters) {
    let params = `order=${filters.order}&order_by=${filters.order_by}&limit=${filters.limit}&offset=${filters.offset}&search=${filters.search}&export=${filters.export}&use_case_id=5`;
    // this.downloadPdfRoleAccess = `${this.urlPort.monolith}/assets/roles-and-access/group?order=${filters.order}&order_by=${filters.order_by}&limit=${filters.limit}&offset=${filters.offset}&search=${filters.search}&export=${filters.export}`;
    // this.showIndeterminateProgress = true;
    this.userservice.getAssignGroups(params, this.urlPort.monolith).subscribe((apiResponse: any) => {
      // this.showIndeterminateProgress = false;
      this.dataSource = apiResponse?.data?.data;
      // console.log("dataSource:",this.dataSource);

      if (this.dataSource?.length > 0) {
        this.listOfGroups = this.dataSource.map(
          item => new DropDownItem(item['id'], item['name'])
        );
      } else {
        this.listOfGroups = [];
      }

    })
  }

  onAssignGroupChange(event) {
    console.log("event:",event)
    let arr = [];
    console.log("dataSource:", this.dataSource);
    for (let i = 0; i < this.dataSource?.length; i++) {
      if (event === this.dataSource[i].id) {
        arr = this.dataSource[i].group_feature_list;
         console.log("arr:", arr);
      }
    }

      console.log("mainArray:", this.mainArray);

      if (arr && arr.length > 0) {
        this.filterFeatures = [];

        this.mainArray?.forEach(element => {
          arr.forEach(elem => {
            if (elem === element.feature_id) {
              this.filterFeatures.push(element)
            }
          })
        })
        console.log("this.filterFeatures:", this.filterFeatures)
      }
  }


  getFeatureListing() {

    this.useCaseId = 5;
    this.userservice.getFeaturesAndPackages(this.useCaseId, '').subscribe((apiResponse: any) => {
      if (!apiResponse.error) {
        this.mainArray = apiResponse['data'];
      } else {
        this.toastr.error(apiResponse.message);
      }
    })
  }
  onSubmitAssignGroup(formvalues) {
    console.log("formvalues:",formvalues)
    this.assignSubmitted = true;
    if (this.assignGroupForm.invalid) {
      return;
    }
    let array = [];
    // if (formvalues?.user?.length > 0) {
    //   for (let i = 0; i < formvalues?.user?.length; i++) {
    //     array.push(formvalues?.user[i].value.email)
    //   }
    // }

    if (this.addGroupCurrentAction == 'add') {
      let dataToSend = {
        "user_guid": formvalues.user,
        "group_id": formvalues.group,
      }
      // this.disableSubmitButton();
      // console.log("dataToSenddataToSend= ", dataToSend)
      this.userservice.addAssignGroup(dataToSend, this.urlPort.monolith).subscribe((response: any) => {
        // this.enableSubmitButton();
        this.toastr.success(response.message, '', {
          progressBar: true,
          progressAnimation: "decreasing",
          timeOut: 3000,
        })
        // this.getTableListing(this.groupFilters);
        // this.closeFormAssign.nativeElement.click();
        this.assignGroupForm.reset();
        this.assignSubmitted = false;
        this.modalRef.close();

      }, err => {
        // this.enableSubmitButton();
        this.toastr.error(err.error.message);
      })
    }
  }

}
