import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoleEnum } from '../../enum/user-role.enum';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/core/custom.validator';
import { ChangePasswordComponent } from 'src/app/core/login/change-password/change-password.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessage } from '../../../core/error-message';
import { ApiService } from '../../../services/api.service';
import { UserService } from 'src/app/core/services/user.service';
import { apiIdentifier, environment, ports } from 'src/environments/environment';
import { GetUserService } from 'src/app/services/get-profile.service';




@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    resetPasswordForm: FormGroup;
    profileSubmitted: boolean = false;
    date_of_joining: Date;
    restrictedForm = false;
    image: any;
    deactivate = false;
    user: any;
    // @ViewChild('closeForm') private closeForm;
    port = ports;
    userGroups;
    showAlert = true;
    public avatar: File = null;
    public avatar_url: string = null;
    imageRemoved: boolean = false;
    isAuthorized = true;//false;
    btnLoading: boolean;
    userType;
    submitted = false;
    errorMessages = [];
    packageName = '';
    userProfileData: any;
    showConfirmPassword = false;
    showCurrentPassword = false;
    passwordIsValid = false;
    showPassword = false;
 
    selectedCountry = '+974';
    dynamicMask = "9999999999";
    myInputVariable: any;
    SSIsEnabled;
    isAdmin;
    closeResult = '';
    // l;ocation fixed krni ha


    constructor(
        private formBuilder: FormBuilder,
        private location: Location,
        private dialog: NgbModal,
        private userService: UserService,
        private toastr: ToastrService,
        private getUserService: GetUserService,
        private authService: AuthService,

    ) {

        this.profileForm = this.formBuilder.group({
            guid: [null],//[{ value: null, disabled: true }],
            username: [null, [CustomValidators.isAlphabetsAndSpace, Validators.required]],
            first_name: [null, [CustomValidators.isAlphabetsAndSpace, Validators.required]],
            last_name: [null, [CustomValidators.isAlphabetsAndSpace, Validators.required]],
            email: [],
            role: [],
            phone: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),  Validators.minLength(8), this.noWhitespaceValidator]],
            date_joined: [],
            preferred_module: [],
            customer: [],
            department: [],
            work_location: [],
            internal_role: []
            
        });


        this.resetPasswordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            password: ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,15}$')
                ])],
            confirmPassword: ['', Validators.required],
        },
            {
                validator: [CustomValidators.samePasswords, CustomValidators.passwordMatcher]
            });

    }

    ngOnInit(): void {
        this.imageRemoved = false;
        // get user profile data
        this.getUserProfileData();
    }

    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    getUserProfileData() {
        this.user = this.authService.getUser();
        if (this.user?.package && this.user?.package?.length > 0) {
            this.packageName = this.user?.package[0]?.package_id__name;
        }

        //     show group name separated by commas if user is ADMIN otherwise if user is SUPERADMIN show SUPERADMIN
        if (this.user['user_type'] == 1) {
            this.profileForm.controls['role'].setValue('Super Admin')
        } else {
            const userGroups = JSON.parse(localStorage.getItem('usergroups'));
            if (userGroups && userGroups.length) {
                let userGroup = [];
                userGroups.forEach(element => {
                    userGroup.push(element.name);
                });
                this.userGroups = userGroup.join(',')
            }
        }

        this.SSIsEnabled = this.user?.customer?.associations.filter(item => {

            return item.package.usecase === 5
        })[0];

        this.isAdmin = (this.user?.user_role_id === UserRoleEnum.Admin);
        const is_customer_client = this.user?.user_role_id === UserRoleEnum.CustomerClient;
        if (is_customer_client) {
            this.restrictedForm = true;
        }

        this.userService.getUserProfileData(this.port.userMS).subscribe((resp: any) => {
            this.userProfileData = resp.data;
            this.setProfileForm(this.userProfileData)
        }, err => {

        })
    }

    setProfileForm(data) {
        // console.log("dataccccccccccc:", data.image);

        this.userType = data.user_type;
        // console.log("usertype", this.userType);
        if (this.userType == 2) {
            this.profileForm.controls.department.disable();
            this.profileForm.controls.work_location.disable();
            this.profileForm.controls.internal_role.disable();
        }
        this.avatar_url = !!data.image ? data?.image : null;
        // console.log("avatar url", this.avatar_url);
        let dt = data['date_joined'].split('-');
        let day = dt[2].split('T');
        let date = { year: +dt[0], month: +dt[1], day: +day[0] };
        data['date_joined'] = date;

 

        if (data != null) {
            // console.log("data if-------",data);

            data['preferred_module'] = 'Smart Surveillance';
            data.customer = data.customer['name'];

            this.profileForm.patchValue(data);
            // this.profileForm.patchValue({
            //     username: data.username ? data.username : null,
            //     first_name: data.first_name ? data.first_name : null,
            //     last_name: data.last_name ? data.last_name : null,
            //     email: data.email ? data.email : null,
            //     phone: data.phone ? data.phone : null,
            //     date_joined: data.date_joined ? data.date_joined : null,
            //     preferred_module: 'Smart Surveillance',
            //     customer: data?.customer?.name ? data?.customer?.name : null,
            //     department: data?.department ? data?.department : null,
            //     work_location: data?.work_location ? data?.work_location : null,
            //     internal_role: data?.internal_role ? data?.internal_role : null,
            // });

            setTimeout(() => {
                if (data.phone.includes('+974')) {
                    data.phone = data.phone.replace('+974', '');
                    this.profileForm.get('phone').setValue(data.phone);
                }
               
            }, 300);

        }
    }
    notImage = false;
    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const img = document.querySelector('#preview img') as HTMLImageElement;
            if (fileList[0].type.indexOf('image') === -1) {
                this.myInputVariable.nativeElement.value = '';
                this.notImage = true;
                this.showAlert = true;
            } else if (file.size > 1000000) { // 1MB
                this.myInputVariable.nativeElement.value = '';
                alert('File is too big! Image must be less than 1 MB');
                this.avatar = null;
            } else {
                this.profileForm.markAsDirty();
                this.notImage = false;
                this.avatar = file;
                this.avatar_url = ' ';
                const reader = new FileReader();
                reader.onload = (function (aImg: any) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        }
    }

    errorMessages1 = [];
    validate() {
        let isValid = true;
        this.errorMessages1 = [];

        if (this.profileForm.get('first_name').hasError('required')) {
            this.errorMessages1.push('First Name ' + ErrorMessage.REQUIRED);
            isValid = false;
        }
        if (this.profileForm.get('first_name').hasError('isAlphabetsAndSpace')) {
            this.errorMessages1.push('First Name should be alphabets');
            isValid = false;
        }
        if (this.profileForm.get('last_name').hasError('required')) {
            this.errorMessages1.push('Last Name ' + ErrorMessage.REQUIRED);
            isValid = false;
        }
        if (this.profileForm.get('last_name').hasError('isAlphabetsAndSpace')) {
            this.errorMessages1.push('Last Name should be alphabets');
            isValid = false;
        }
        // if (this.profileForm.get('phone').hasError('required')) {
        //   this.errorMessages1.push('Contact Number ' + ErrorMessage.REQUIRED);
        //   isValid = false;
        // }


        if (this.profileForm.get('phone').hasError('required') || this.profileForm.get('phone').hasError('whitespace')) {
            this.errorMessages.push('phone ' + ErrorMessage.REQUIRED);
            isValid = false;
        }
        return isValid;
    }

    validateForUserNameField() {
        let isValid = true;
        this.errorMessages1 = [];

        if (this.profileForm.get('username').hasError('required')) {
            this.errorMessages1.push('User Name ' + ErrorMessage.REQUIRED);
            isValid = false;
        }
        if (this.profileForm.get('username').hasError('isAlphabetsAndSpace')) {
            this.errorMessages1.push('User Name should be alphabets');
            isValid = false;
        }

        if (this.profileForm.get('phone').hasError('required') || this.profileForm.get('phone').hasError('whitespace')) {
            this.errorMessages.push('phone ' + ErrorMessage.REQUIRED);
            isValid = false;
        }

        return isValid;
    }

    onSubmit(formValue) {
        // console.log("formValue = = = = = ", formValue)
        this.profileSubmitted = true;
        delete formValue['email'];
        delete formValue['role'];
        delete formValue['group'];
        delete formValue['preferred_module'];
        delete formValue['customer'];
        delete formValue['date_joined'];
        formValue['guid'] = this.userProfileData.guid;
        formValue['phone'] = formValue.phone ? this.selectedCountry + formValue.phone : "";
        if (formValue['department'] == null) {
            formValue['department'] = ''
        }
        if (formValue['work_location'] == null) {
            formValue['work_location'] = ''
        }
        if (formValue['internal_role'] == null) {
            formValue['internal_role'] = ''
        }

        if (this.user?.user_type == 2) {

            formValue['username'] = formValue.username;
            this.profileForm.controls['username'].setValidators([CustomValidators.isAlphabetsAndSpace, Validators.required]);
            this.profileForm.controls['username'].updateValueAndValidity();

            if (this.validateForUserNameField()) {
                if (!!(this.avatar)) {
                    formValue['image'] = this.avatar;
                }
                else if (!!(this.avatar_url)) {

                } else {
                    if (this.imageRemoved) {
                        // if user has removed image then send '' (empty string) in API param 
                        formValue['image'] = '';
                    } else {
                        // if user doesnot change the image, donot send the 'image' key in API param
                        delete formValue['image'];
                    }
                }

                this.disableSubmitButton();
                localStorage.setItem("notificationCount", '0')
                this.userService.updateUserPrfole(formValue, this.port.userMS).subscribe((apiResponse: any) => {
                    this.enableSubmitButton();
                    this.toastr.success(apiResponse.message, '', {
                        progressBar: true,
                        progressAnimation: "decreasing",
                        timeOut: 3000,
                    })

                    formValue['phone'] = (formValue['phone']).replace(this.selectedCountry, '')

                    this.profileForm.markAsPristine();
                    const u = this.authService.getUser();
                    u['username'] = apiResponse['data']['username'];
                    u['image'] = apiResponse['data']['image'];
                    u['first_name'] = apiResponse['data']['first_name'];
                    u['last_name'] = apiResponse['data']['last_name'];
                    u['phone'] = apiResponse['data']['phone'];
                    this.authService.setUser(u);
                    localStorage.setItem('user', JSON.stringify(u));

                    this.getUserService.setValue(u);
                    this.imageRemoved = false;
                    this.deactivate = true;
                    this.submitted = true;
                    this.profileSubmitted = true;

                }, err => {
                    this.enableSubmitButton();
                    this.toastr.error(err.error.message, '', {
                        progressBar: true,
                        progressAnimation: "decreasing",
                        timeOut: 3000,
                    })
                })
            }

        } else {
            if (this.validate()) {

                if (!!(this.avatar)) {
                    formValue['image'] = this.avatar;
                }
                else if (!!(this.avatar_url)) {

                } else {
                    if (this.imageRemoved) {
                        // if user has removed image then send '' (empty string) in API param 
                        formValue['image'] = '';
                    } else {
                        // if user doesnot change the image, donot send the 'image' key in API param
                        delete formValue['image'];
                    }
                }

                this.disableSubmitButton();
                localStorage.setItem("notificationCount", '0')


                delete formValue['username'];
                this.profileForm.controls['username'].setValidators(null);
                this.profileForm.controls['username'].updateValueAndValidity();

                this.userService.updateUserPrfole(formValue, this.port.userMS).subscribe((apiResponse: any) => {
                    this.enableSubmitButton();
                    this.toastr.success(apiResponse.message, '', {
                        progressBar: true,
                        progressAnimation: "decreasing",
                        timeOut: 3000,
                    })

                    formValue['phone'] = (formValue['phone']).replace(this.selectedCountry, '')

                    this.profileForm.markAsPristine();
                    const u = this.authService.getUser();
                    u['username'] = apiResponse['data']['username'];
                    u['image'] = apiResponse['data']['image'];
                    u['first_name'] = apiResponse['data']['first_name'];
                    u['last_name'] = apiResponse['data']['last_name'];
                    u['phone'] = apiResponse['data']['phone'];
                    this.authService.setUser(u);
                    localStorage.setItem('user', JSON.stringify(u));

                    this.getUserService.setValue(u);
                    this.imageRemoved = false;
                    this.deactivate = true;
                    this.submitted = true;
                    this.profileSubmitted = true;

                }, err => {
                    this.enableSubmitButton();
                    this.toastr.error(err.error.message, '', {
                        progressBar: true,
                        progressAnimation: "decreasing",
                        timeOut: 3000,
                    })
                })
            }
        }
    }

    validatePasswordForm(): boolean {
        let isValid = true;
        this.errorMessages = [];
        if (this.resetPasswordForm.hasError('mismatch')) {
            this.errorMessages.push('Mismatch Password');
            isValid = false;
        }
        if (this.resetPasswordForm.hasError('same')) {
            this.errorMessages.push('Password cannot be same');
            isValid = false;
        }
        return isValid;
    }

    onSubmitResetPassword(formValues, modal?: any) {
        if (this.validatePasswordForm()) {
            const params = {};
            params['email'] = this.userProfileData.email;
            params['current_password'] = formValues.oldPassword;
            params['new_password'] = formValues.confirmPassword;
            this.userService.resetPasswordFirstTime(params, this.port.userMS).subscribe((data: any) => {
                modal.close();
                this.toastr.success(data.message, '', {
                    progressBar: true,
                    progressAnimation: "decreasing",
                    timeOut: 3000,
                })
            }, err => {
                this.toastr.error(err.error.message, '', {
                    progressBar: true,
                    progressAnimation: "decreasing",
                    timeOut: 3000,
                })
            });
        }
    }

    resetPasswordform() {
        this.resetPasswordForm.reset();
    }

    onAddresetForm(content) {
        this.dialog.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }



    get f() {
        return this.resetPasswordForm.controls;
    }

    getSelectedCountry(country) {
        if (country.code == "+92") {
            this.dynamicMask = "9999999999";
        } else {
            this.dynamicMask = "99999999";
        }
        this.selectedCountry = country.code;
    }





    removeImage() {
        if (this.myInputVariable) {
            this.myInputVariable.nativeElement.value = '';
        }
        this.avatar_url = null;
        this.profileForm.markAsDirty();
        this.avatar = null;
        this.notImage = false;
        this.imageRemoved = true;
        this.image.nativeElement.src = '/assets/images/iol/driver_placeholder.png';
    }

    //Start

    // canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //     if (this.deactivate && this.profileForm.dirty && this.submitted) {
    //       this.deactivate = false;
    //       this.submitted = false;
    //     }
    //     if (this.deactivate) {
    //       return true;
    //     }
    //     return true;
    //   }

    //End
    toggleNewPassword(value) {
        this.showPassword = value.password;
    }


    toggleOldPassword(value) {
        this.showCurrentPassword = value.oldPassword;
    }
    passwordValid(event) {
        this.passwordIsValid = event;
    }
    toggleConfirmPassword(value) {
        this.showConfirmPassword = value.confirmPassword;
    }
    resetPassword() {
        this.resetPasswordForm.reset();
    }

    openResetPasswordModel() {
        // const modalRef = this.modal.open
    }
    backClicked() {
        this.location.back();
    }
    enableSubmitButton() {
        this.btnLoading = false;
    }

    disableSubmitButton() {
        this.btnLoading = true;
    }


}
