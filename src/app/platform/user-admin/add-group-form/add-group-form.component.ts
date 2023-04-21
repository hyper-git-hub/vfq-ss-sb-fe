import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { ToastrService } from 'ngx-toastr';
import { ports } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { DropDownItem } from '../../../interfaces/dropdown-item';
import { HeaderService } from 'src/app/core/services/header.service';

@Component({
  selector: 'app-add-group-form',
  templateUrl: './add-group-form.component.html',
  styleUrls: ['./add-group-form.component.scss']
})
export class AddGroupFormComponent implements OnInit {

  loggedInUser

  addGroupForm: FormGroup;
  title: any;
  btnText: any;
  submitted: boolean = false;


  apiResponse: any;
  urlPort = ports;
  port = ports;
  data: any;
  loggedInUserPackageID: any;

  // dual list variables
  // dual list variables
  keepSorted = true;
  key: string;
  display: any;
  filters: any = [];
  source: Array<any>;
  confirmed: Array<any>;
  disabled = false;
  sourceStations: Array<any>;
  confirmedStations: Array<any>;
  stations = [];
  selectedGroups = [];
  associatedUserTrack = [];

  selectedGroupToEdit: any;
  moduleId: any;
  useCaseId: any;
  category: any;

  subscription: Subscription;
  CompleteData: any[] = [];
  mainArray: any[] = [];
  listOfAssociatedUsers: any[];
  unAssignedUsers: any[];
  access = [
    { id: 1, name: 'Read' },
    { id: 2, name: 'Write' }
  ];

  constructor(
    private fb: FormBuilder, private toastr: ToastrService,
    private modalRef: NgbActiveModal, public userservice: UserserviceService,
    private headerService: HeaderService, private authService: AuthService
  ) {
    this.addGroupForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), this.noWhitespaceValidator]],
      description: ["", [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), this.noWhitespaceValidator]],
      associatedUsers: [''],
      permission: ['']
    })
    this.addGroupForm.get('permission').setValue(1);

    this.data = null;
    this.confirmed = [];
    this.listOfAssociatedUsers = [];
    this.unAssignedUsers = [];
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();

    if (this.data && this.data.id) {
      this.openEdit();
    } else {
      this.getGroupData(this.data);
    }

    this.loggedInUserPackageID = this.loggedInUser?.customer?.associations.filter(item => {
      return item.package.usecase === 5
    })[0]?.package?.package_id;
  }

  ngAfterViewInit() {
  }

  initListBox() {
    this.sourceStations = JSON.parse(JSON.stringify(this.stations));
    this.confirmedStations = JSON.parse(JSON.stringify(this.confirmed));
    this.useStations();
  }

  useStations() {
    this.key = 'key';
    this.display = this.stationLabel;
    this.keepSorted = true;
    this.source = this.sourceStations;
    this.confirmed = this.confirmedStations;
  }

  openEdit() {
    this.selectedGroupToEdit = this.data;
    this.selectedGroups = [];

    if (this.unAssignedUsers.length > 0) {
      this.unAssignedUsers.forEach(element => {
        this.listOfAssociatedUsers.push({user_guid: element.guid, user_email: element.email});
      });
    }

    if (this.data?.group_user && this.data?.group_user?.length > 0) {
      this.data.group_user.forEach(element => {
        this.listOfAssociatedUsers.push(element);
      });

      this.selectedGroups = this.data?.group_user.map(
        item => new DropDownItem(item['user_guid'], item['user_email'])
      );
    }

    setTimeout(() => {
      this.addGroupForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        permission: this.data.permission,
        associatedUsers: this.selectedGroups
      });
    }, 300);



    if (this.data.group_feature_list && this.data.group_feature_list?.length > 0) {
      let featureArray = [];
      let got = [];
      let source = [];

      this.data.group_feature_list.forEach(element => {
        featureArray.push(element)
      });

      this.data.stations.forEach(child => {
        featureArray.forEach(elem => {
          if (elem === child.feature_id) {
            const childPush = { feature_id: child.feature_id, key: child.feature_id, name: child.feature_name, station: child.feature_name };
            got.push(childPush)
          } else {
            const childPush = { feature_id: child.feature_id, key: child.feature_id, name: child.feature_name, station: child.feature_name };
            source.push(childPush)
          }
        })
      })



      this.confirmed = got;
      this.stations = source;

      this.initListBox();
    }
  }

  stationLabel(item: any) {
    return item.station;
  }


  getGroupData(mainArray) {
    this.stations = [];
    mainArray.forEach(element => {
      element.key = element.feature_id;
      element.station = element.feature_name;
      this.stations.push(element);
    });
    this.initListBox();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onCloseModel() {
    this.modalRef.close();
  }

  onSubmitAddGroup(formvalues) {
    this.submitted = true;

    if (this.addGroupForm.invalid) { //this.validate() || this.groupForm.invalid
      return;
    }

    let menulist = [];
    for (let i = 0; i < this.confirmed.length; i++) {
      menulist.push(this.confirmed[i].feature_id)
    }



    if (menulist.length == 0) {
      if (this.btnText == 'Save') {
        return;
      }
      if (this.btnText == 'Update') {
        return;
      }
    }


    if (this.btnText == 'Save') {
      this.createGroup(formvalues, menulist)
    } else {
      this.updateGroup(formvalues, menulist);
    }
  }

  createGroup(formvalues, menulist) {

    let dataToSend = {
      "name": formvalues.name,
      "description": formvalues.description,
      "features": menulist,
      "use_case": 5,
      "permission": formvalues.permission
    }
    // this.disableSubmitButton();
    this.userservice.addGroup(dataToSend, this.urlPort.monolith).subscribe((response: any) => {

      // this.enableSubmitButton();
      this.toastr.success('', response.message, {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      })

      this.addGroupForm.reset();
      this.submitted = false;
      this.modalRef.close();
    }, err => {
      // this.enableSubmitButton();
      this.toastr.error(err.error.message);
    })
  }

  updateGroup(formvalues, menulist) {

    let dataToSendEdit = {
      "name": formvalues.name,
      "description": formvalues.description,
      "features": menulist,
      "permission": formvalues.permission,
      "id": this.data.id,
      "status": 1
    }

    let finalesectedGroup: any = [];

    this.selectedGroups.forEach(element => {
      finalesectedGroup.push(element.id)
    });

    // dataToSendEdit['users'] = this.getIdsFromJSONArray(this.selectedGroups);
    let dataToSendUnAssign = {
      "group_id": this.data.id,
      "user_guid": finalesectedGroup
    }
    // this.disableSubmitButton();
    this.userservice.updateGroup(dataToSendEdit, this.urlPort.monolith).subscribe((response: any) => {
      // this.enableSubmitButton();
      this.modalRef.close();
      this.toastr.success('', response.message, {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      })

      // Update the new edited features to show & hide the sidebar 
      if (this.loggedInUser?.user_type != 1) {
        // if user is not superadmin
        this.headerService.getFeatures(this.urlPort.monolith).subscribe((apiResponse: any) => {
          let array = apiResponse.data.features;
          localStorage.setItem('usergroups', JSON.stringify(apiResponse.data.groups))
          this.loggedInUser = this.authService.getUser();
          if (this.loggedInUser && this.loggedInUser.user_type != 1 && this.associatedUserTrack.includes(this.loggedInUser?.guid)) {
            this.logout();
          }
        })
      }


      // // unallocate the user from a group
      // if (this.listOfAssociatedUsers.length > 0) {
      //   this.userservice.unallocateUserFromGroup(dataToSendUnAssign, this.urlPort.monolith).subscribe((response: any) => {

      //   })
      // }

      this.addGroupForm.reset();
      this.submitted = false;

    }, err => {
      this.toastr.error(err.error.message);
    })
  }


 

  /*** logout the cureent logged In user */
  logout() {
    let userEmail = JSON.parse(localStorage.getItem('user'))
    let params = { 'email': userEmail.email }
    this.headerService.logOut(params, this.port.userMS).subscribe((data: any) => {
      this.authService.unsetUser();
      localStorage.removeItem("configurations")
      localStorage.removeItem("token")
      localStorage.removeItem("notificationCount")
      localStorage.removeItem("usergroups")
      if (localStorage.getItem('useremail') == '') {
        localStorage.removeItem('useremail')
      }
      if (localStorage.getItem('userpassword') == '') {
        localStorage.removeItem('userpassword')
      }

      let val = localStorage.getItem('setvalue');
    })
  }

  assetAssociateUserChanged(event) {
    // console.log(event.itemValue)
    if (event && event.itemValue) {
      let selectedValue = event.itemValue.id;
      if (this.associatedUserTrack && this.associatedUserTrack.length > 0) {
        if (this.associatedUserTrack.includes(selectedValue)) {
          this.associatedUserTrack.forEach((element, i) => {
            if (element === selectedValue) {
              this.associatedUserTrack.splice(i, 1);
            }
          });
        } else {
          this.associatedUserTrack.push(selectedValue)
        }
      } else {
        this.associatedUserTrack.push(selectedValue)
      }


    }
  }


}
