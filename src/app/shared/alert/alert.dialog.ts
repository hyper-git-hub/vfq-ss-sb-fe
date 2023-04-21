import { OnInit, Component, Input, HostListener } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VAlert, VAlertAction } from './alert.model';


export class AlertData
{
	heading: string = '';
	message: string = '';
	type: 'ask' | 'success' | 'error' | 'info' = 'success';
	leftButton!: {
		text: string;
		class: string
	};
	rightButton!: {
		text: string;
		class: string
	};
}

@Component({
	selector: 'app-alert-dialog',
	templateUrl: './alert.dialog.html',
    styleUrls: ['./alert.dialog.scss'],
})
export class AlertDialogComponent implements OnInit
{
	@Input() alert!: VAlert;

	theForm: FormGroup;
	isConfirm = false;
	showInput = false;

	alertData!: AlertData;

	constructor(
		private dialogRef: NgbActiveModal,
		private fb: FormBuilder)
	{
		this.theForm = this.fb.group({ input: new FormControl() });
	}

	ngOnInit(): void
	{
		if (this.alert.required)
		{
			this.theForm.controls['input'].setValidators([Validators.required]);
		}
		else
		{
			this.theForm.controls['input'].setValidators(null);
		}

		this.isConfirm = this.alert.type === 'confirm' || this.alert.type === 'confirmWithInput';
		this.showInput = this.alert.type === 'confirmWithInput';
	}

	@HostListener('window: keyup.esc') onKeyUp(): void
	{
		this.dismissAlert();
	}

	@HostListener('window: keyup.enter') onKeyUp2(): void
	{
		if (this.theForm.invalid) { return; }
		this.onPositive();
	}

	onPositive(): void
	{
		let r = new VAlertAction(this.alert, true);

		if (this.alert.type === 'confirmWithInput')
		{
			r = new VAlertAction(this.alert, true, this.theForm.controls['input'].value);
		}

		this.dialogRef.close(r);
	}

	onNegative(): void
	{
		const r = new VAlertAction(this.alert, false);
		this.dialogRef.close(r);
	}
	
	dismissAlert(): void
	{
		const r = new VAlertAction(this.alert, false);
		this.dialogRef.close();
	}
}
