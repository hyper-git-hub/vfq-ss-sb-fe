import { FormControl, Validators } from "@angular/forms";

export class FormConfig {
    title: string;
    layout: string;
    flexGap: string;
    layoutAlign: string;
    showTimeInterval: boolean;
    showtime: boolean;
    columns: FormField[];
    actions: FormAction[];

    constructor(params: any) {
        this.title = params.title === void 0 ? 'Form' : params.title;
        this.layout = params.layout === void 0 ? 'row' : params.layout;
        this.flexGap = params.flexGap === void 0 ? '12px' : params.flexGap;
        this.showtime = params.showtime === void 0 ? false : params.showtime;
        this.layoutAlign = params.layoutAlign === void 0 ? 'start start' : params.layoutAlign;
        this.showTimeInterval = params.showTimeInterval === void 0 ? false : params.showTimeInterval;
        this.columns = [];

        if (params !== void 0 && params.columns !== void 0)
        {
            params.columns.forEach((col: any) =>
            {
                this.columns.push(new FormField(col));
            });
        }

        this.actions = [];
        if (params.actions !== void 0) {
            params.actions.forEach(ac => {
                this.actions.push(ac)
            });
            this.actions
        }
    }
}

export class FormField {
    name: string;
    // hidden, text, textarea, number, email, password, checkbox, radio, dropdown, switch
    // file: image, audio, video, application, pdf
    // date, time, datetime, location, foreign
    type: string;
    title: string;
    flex?: string;
    placeholder?: string;

    disableDatePicker?: boolean;
    clearable?: boolean;
    required?: boolean;
    disable?: boolean;
    readonly?: boolean;
    // tslint:disable-next-line:variable-name
    min_date?: number;
    validators?: string[];
    width?: number;
    hint?: string;
    exclude?: boolean;
    searchType?: string;        // Search Field Validation
    options?: string[];         // Dropdown or Radio

    // tslint:disable-next-line:variable-name
    allowed_types?: string[];   // For File field

    formControl?: FormControl;
    loading: boolean;
    // tslint:disable-next-line:variable-name
    allow_translation?: boolean;
    default?: any;
    api: string;

    minLength?: number;
    maxLength?: number;
    exactLength?: number;
    hideNumberArrow?: boolean = false;

    constructor(params?: any) {
        if (params === void 0) {
            params = {};
        }

        this.loading = false;
        this.name = params.name;
        this.type = params.type || 'text';
        this.title = params.title;
        this.flex = params.flex === void 0 ? '16.7%' : params.flex;
        this.hint = (params.hint === void 0) ? null : params.hint;
        this.width = params.width || 100;

        this.placeholder = params.placeholder || params.title;
        this.searchType = params.searchType || 'text';
        this.disableDatePicker = (params.disableDatePicker === void 0) ? false : params.disableDatePicker;
        this.clearable = (params.clearable === void 0) ? false : params.clearable;
        this.required = (params.required === void 0) ? false : params.required;
        this.disable = (params.disable === void 0) ? false : params.disable;
        this.readonly = (params.readonly === void 0) ? false : params.readonly;
        this.min_date = (params.min_date === void 0) ? null : params.min_date;
        this.default = (params.default === void 0) ? null : params.default;

        this.exclude = (params.required === void 0) ? false : params.exclude;

        this.minLength = (params.minLength === void 0) ? null : params.minLength;
        this.maxLength = (params.maxLength === void 0) ? null : params.maxLength;
        this.exactLength = (params.exactLength === void 0) ? null : params.exactLength;
        this.hideNumberArrow = (params.hideNumberArrow === void 0) ? false : params.hideNumberArrow;

        if (this.type === 'dropdown' || this.type === 'radio') {
            this.options = params.options || [];
        }

        this.validators = params.validators || [];
        this.allowed_types = params.allowed_types || [];
        this.api = params.api || null;
        this.formControl = new FormControl(this.default);

        if (this.exactLength != null) {
            this.minLength = this.maxLength = this.exactLength;
        }

        const validators = [];
        if (this.formControl.validator) {
            validators.push(this.formControl.validator);
        }

        if (this.minLength != null) {
            validators.push(Validators.minLength(this.minLength));
        }

        if (this.maxLength != null) {
            validators.push(Validators.maxLength(this.maxLength));
        }

        this.formControl.setValidators(validators);

        this.allow_translation = (params.allow_translation === void 0) ? false : params.allow_translation;
    }

    get error(): string {
        if (this.formControl.hasError('required')) return `${this.title} is required`;

        if (this.formControl.hasError('email')) {
            return 'Invalid email';
        }

        if (this.formControl.hasError('minlength')) return `Minimum length is ${this.minLength}`;

        if (this.formControl.hasError('maxlength')) return `Maximum length is ${this.maxLength}`;
    }

    get valid(): boolean {
        return this.formControl ? this.formControl.valid : false;
    }

    get touched(): boolean {
        return this.formControl ? this.formControl.touched : false;
    }

    get invalid(): boolean {
        return this.valid;
    }

    set value(val: any) {
        this.formControl.setValue(val);
    }

    get value() {
        return this.formControl.value;
    }
}

export class FormAction {
    name: string;
    icon: string;
    color: string;
    action: string;

    constructor(params: any) {
        this.name = params.name; 
        this.icon = params.icon; 
        this.color = params.color; 
        this.action = params.action; 
    }
}


export class ButtonAction
{
    type: 'onSubmit' | 'onCancel' | 'search' | 'onFilter' | 'onReset';
    row?: any;

    constructor(params: any) {
        this.type = params?.action || null;
    }
}