import * as dateFns from 'date-fns';


function convertIntoTime(v: any) {
    const ls = v.split(':');
    const s = Math.round(ls[2]);
    const t = `${ls[0]}:${ls[1]}:${s}`.toString();
    return t;
}

function convertIntoUnixTime(v: any) {
    const cd = dateFns.format(new Date(), 'yyyy-MM-dd');
    const t = Date.parse(cd + ' ' + v);
    const fv = dateFns.format(t, 'hh:mm a');
    return fv;
}

function convertFromUTC(v: any) {
    let offset = Math.abs(new Date().getTimezoneOffset());
    let t = new Date();
    t.setSeconds(t.getSeconds() + offset);
    let currentDate = dateFns.format(t, 'yyyy-MM-dd');
    currentDate = getLocalMMDDYYYYhhmmssATime(currentDate + ' ' + v);
    return currentDate;
}

function getLocalMMDDYYYYhhmmssATime(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = dateFns.addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return dateFns.format(localDate, 'hh:mm:ss a');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

export const DATE_FORMAT: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? dateFns.format(new Date(v), 'dd-MM-yyyy') : dateFns.format(new Date(v * 1000), 'dd-MM-yyyy');
export const FULL_TIME: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? dateFns.format(new Date(v), 'hh:mm:ss a') : dateFns.format(new Date(v * 1000), 'hh:mm:ss a');
export const STRING_TIME: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? convertIntoTime(v) : dateFns.format(new Date(v * 1000), 'hh:mm a');
export const TIME: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? dateFns.format(new Date(v), 'hh:mm a') : dateFns.format(new Date(v * 1000), 'hh:mm a');
export const DATETIME_FORMAT: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? dateFns.format(new Date(v), 'dd-MM-yyyy, hh:mm a') : dateFns.format(new Date(v * 1000), 'dd-MM-yyyy, hh:mm a');
export const DATETIME_FORMAT_FULLTIME: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? dateFns.format(new Date(v), 'dd-MM-yyyy, hh:mm:ss a') : dateFns.format(new Date(v * 1000), 'dd-MM-yyyy, hh:mm:ss a');
export const STRING_TIME2: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? convertIntoUnixTime(v) : dateFns.format(new Date(v * 1000), 'hh:mm a');
export const STRING_TIMEUTC: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof (v) === 'string') ? convertFromUTC(v) : dateFns.format(new Date(v * 1000), 'hh:mm a');
export const FORMATS: any = {
    date: DATE_FORMAT,
    datetime: DATETIME_FORMAT,
    fulltime: FULL_TIME,
    time: TIME,
    strtime: STRING_TIME,
    strtime2: STRING_TIME2,
    fulldatetime: DATETIME_FORMAT_FULLTIME,
    timeutc: STRING_TIMEUTC,
}