import { Subject } from 'rxjs';

export class VAlertAction
{
    alert: VAlert;
    positive: boolean;
    value?: any;

    constructor(alert: VAlert, positive: boolean, value?: any)
    {
        this.alert = alert;
        this.positive = positive;
        this.value = value;
    }
}

type alertType = 'success' | 'error' | 'info' | 'warning' | 'confirm' | 'confirmWithInput';

export class VAlert
{
    type: alertType;
    title: string;
    message?: string;
    action?: string;
    secAction?: string;
    required: boolean;

    icon?: string;
    iconText?: string;

    positive?: string;
    negative?: string;
    placeholder?: string;

    subject: Subject<VAlertAction>;

    constructor(type: alertType, title: string, message?: string, action?: string, secAction?: string, required?: boolean)
    {
        this.type = type;
        this.title = title;
        this.message = message;
        this.action = action;
        this.secAction = secAction;
        this.required = required === void 0 ? true : required;
        this.subject = new Subject<VAlertAction>();

        switch (this.type)
        {
            case 'success':
                this.icon = 'ri-check-double-line';
                this.positive = 'Ok';
                break;
            case 'error':
                this.icon = 'ri-close-fill';
                this.positive = 'Ok';
                break;
            case 'info':
                this.iconText = 'i';
                this.positive = 'OK';
                break;
            case 'warning':
                this.iconText = '!';
                this.positive = 'OK';
                break;
            case 'confirm':
                this.iconText = '?';
                this.positive = 'Yes';
                this.negative = 'Cancel';
                break;
            case 'confirmWithInput':
                this.iconText = '?';
                this.positive = 'Yes';
                this.negative = 'Cancel';
                break;
        }
    }
}
