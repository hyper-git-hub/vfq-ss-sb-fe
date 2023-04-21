import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ButtonAction, FormConfig, FormField } from './models';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-general-forms',
  templateUrl: './general-forms.component.html',
  styleUrls: ['./general-forms.component.scss'],
})
export class GeneralFormsComponent implements OnInit, OnDestroy {
  @Input() config: FormConfig;
  @Input() intervalConfig: FormConfig;
  @Input() generalForm: FormGroup;
  @Input() actions: Subject<any>;
  @Output() signals = new EventEmitter<any>();
  @Input() data: any;
  formFields: any[]; //FormField[];
  formFieldsDict: any;
  formSections: FormGroup;
  model: NgbDateStruct;
  idRefDatePicker: any;
  enableCalender: boolean = false;
  disableDatePicker: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.config = null;
    this.intervalConfig = null;
    this.actions = null;
    this.generalForm = this._fb.group({});
    this.formFields = [];
    this.formFieldsDict = {};
    this.data = null;
    this.disableDatePicker = false;

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // console.log(this.config?.columns);
    this.config?.columns.forEach((dc: FormField) => {
      if (!dc.exclude) {
        let field: FormField;
        if (dc.formControl === void 0) {
          field = new FormField(dc);

          // if (dc.minLength != null) {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.minLength(dc.minLength)] : [Validators.minLength(dc.minLength)]);
          // }

          // if (dc.maxLength != null) {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.maxLength(dc.maxLength)] : [Validators.maxLength(dc.maxLength)]);
          // }

          // if (dc.type === 'email') {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.email] : [Validators.email]);
          // }
        } else {
          // if (dc.type === 'email') {
          //   dc.formControl.setValidators(dc.formControl.validator ? [dc.formControl.validator, Validators.email] : [Validators.email]);
          // }

          field = dc;
        }
        this.generalForm.addControl(field.name, field.formControl);
        this.formFields.push(field);
        this.formFieldsDict[field.name] = field;
      }
    });

    this.intervalConfig?.columns.forEach((dc: FormField) => {
      if (!dc.exclude) {
        let field: FormField;

        if (dc.formControl === void 0) {
          field = new FormField(dc);

          // if (dc.minLength != null) {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.minLength(dc.minLength)] : [Validators.minLength(dc.minLength)]);
          // }

          // if (dc.maxLength != null) {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.maxLength(dc.maxLength)] : [Validators.maxLength(dc.maxLength)]);
          // }

          // if (dc.type === 'email') {
          //   field.formControl.setValidators(field.formControl.validator ? [field.formControl.validator, Validators.email] : [Validators.email]);
          // }
        } else {
          // if (dc.type === 'email') {
          //   dc.formControl.setValidators(dc.formControl.validator ? [dc.formControl.validator, Validators.email] : [Validators.email]);
          // }

          field = dc;
        }

        this.generalForm.addControl(field.name, field.formControl);
        this.formFields.push(field);
        // console.log('this.formFields== ', this.formFields);
        this.formFieldsDict[field.name] = field;
      }
    });

    // Add controls in form
    // if (this.config['sections'].length > 0) {
    //   this.formSections = this._fb.group({});
    //   this.generalForm.addControl('sections', this.formSections);
    // }

    if (!!this.actions) {
      this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: ButtonAction) => {
        this.handleFormActions(e);
      });
    }

    this.generalForm.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.signals.emit({ type: 'filterValues', data: value });
    });
  }

  onKeyPress(ev: any) {
    if (ev.target.selectionStart === 0 && ev.keyCode === 32) {
      return false;
    }
  }

  changedRadioButtons(event, value) {
    // console.log(event, value);
    let data: any = []
    data = value
    // console.log('value== >>> ', data ,  data.value);

    if (data.value === 'period') {
      this.disableDatePicker = false;
    } else {
      this.disableDatePicker = true;
    }

    this.signals.emit({ type: 'timeInterval', data: value });
  }

  changeddropdown(event) {
    // console.log('event== ', event);
    this.signals.emit({ type: 'filterdropdown', data: event });

    // if (value?.value == '"radio3"') {
    //   this.disableDatePicker = false;
    // } else {
    //   this.disableDatePicker = true;
    // }
  }

  // selectDate(event) { //end_timef
  //   console.log("event:",event.toString());
  //   const selectPeriodDate = DateUtils.getYYYYMMDD(event);
  //     // const sDate = selectPeriodDate;
  //     console.log("selectPeriodDate:",selectPeriodDate);

  // }

  // onAction(action: FormAction) {
  //   console.log("onACtion");
  //   const ac = { type: action.action, data: this.generalForm.value };
  //   this.signals.emit(ac);
  // }

  // onSubmit() {
  //   const value = this.generalForm.value;
  //   this.signals.emit({ type: "onSubmit", value: value })

  // }

  handleFormActions(action: ButtonAction) {
    switch (action.type) {
      case 'onSubmit':
        this.signals.emit({ type: action.type, data: this.generalForm.value });
        break;
      case 'onReset':
        this.generalForm.reset();
        break;
    }
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll != null) {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }
}
