export class Helpers {
    static convertUTCtoLocalDatetime(datetime: any) {
        if (datetime) {
            const dt = new Date(datetime);
            let newDate = new Date(dt.getTime() + dt.getTimezoneOffset());
            
            return newDate;
        }
    }
}