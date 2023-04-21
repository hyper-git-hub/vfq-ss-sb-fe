// Created by Mushahid on 06-11-2020.
import { format, addMinutes, subMinutes, subWeeks, subDays, subMonths, startOfToday, endOfToday, isValid, endOfYesterday, addDays } from 'date-fns';
import * as moment from 'moment';


export class DateUtils {

  static now(): Date {
    return new Date();
  }

  static addDa(date) {
    return addDays(date, 1);
  }
  static addDaysWithNumber(date, nummber) {
    return addDays(date, nummber);
  }

  static isValid(date: any): Boolean {
    return isValid(new Date(date));
  }

  // static getMMMMDY(date: string) {
  //   return format(date, 'MMM DD, YYYY');
  // }

  // static formatDate(date: string) {
  //   let lala = this.getLocalMMDDYYYYhhmmssA(date);
  //   return format(date, 'MMM DD, YYYY HH:mm:ss A');
  // }

  static getLocalhhmmA(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const localDate = new Date(date);
        return format(localDate, 'hh:mm A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }


  // input utc as '2017-12-04 07:23:56+00:00' or any valid parseable date as string
  // out local as '2017-12-04 02:23:56'
  static getLocalYYYYMMDDHHmmss(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'MMM, DD, YYYY, hh:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  // input utc as '2017-12-04 07:23:56+00:00' or any valid parseable date as string
  // out local as '2017-12-04 02:23:56'
  static getLocalMMDDYYYYhhmmssA(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'MMM, DD, YYYY, hh:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getLocalMMDDYYYYhhmmssATime(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  // static getLocalMMDDYYYYhhmm(date: string): string {
  //   return format(date, 'hh:mm');
  // }

  static getLocalMMDDYYYYhhmmssATimee(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'hh:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  // input local as '2017-12-04 02:23:56' or any valid parseable date as string
  // out utc as '2017-12-04 07:23:56'  2018-01-01T01:00
  static getUTCYYYYMMDDHHmmsstemp(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(localDate, 'YYYY-MM-DDTHH:mm');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getUTCYYYYMMDDHHmmss(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(localDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getLocalYYYYMMDDHHmmssA(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'YYYY:MM:DD : HH:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getLocalMMDDYYYYhhmmss(date: any) {
    if (date) {
      try {
        var local = moment(moment.unix(date).format('MMM DD, YYYY hh:mm:ss a'), ['MMM DD, YYYY hh:mm:ss a']);
        return (moment(local).format('MMM DD, YYYY, hh:mm:ss A'));
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }


  static getMMDDYYYYhhmmssA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM DD, YYYY, hh:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static convertDateToLocal(date: any) {
    var local = moment(moment.unix(date).format('MMM DD, YYYY hh:mm a'), ['MMM DD, YYYY hh:mm a']);
    return moment(local).format('MMM DD, YYYY');
  }

  static convertDateTimeToLocal(date: any) {
    date = new Date(date).getTime() / 1000;
    var local = moment(moment.unix(date).format('MMM DD, YYYY hh:mm a'), ['MMM DD, YYYY hh:mm a']);
    return moment(local).format('MMM DD, YYYY, hh:mm:ss A');
  }

  static getYYYY(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'YYYY');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getMMM(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getDD(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'DD');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getMMMYY(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM-YY');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getMMMYYYY(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM-YYYY');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getDDMMM(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'DD-MMM');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static gethhmmssA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        const utcDate = addMinutes(localDate, new Date().getTimezoneOffset());
        return format(utcDate, 'HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static gethhmmssAA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        const utcDate = addMinutes(localDate, new Date().getTimezoneOffset());
        return format(utcDate, 'hh:mm:ss A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static gethhmmAA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        const utcDate = addMinutes(localDate, new Date().getTimezoneOffset());
        return format(utcDate, 'hh:mm A');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }


  static gethhmmA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'hh:mm:a');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static getUTCtoLocalTimestamp(utcTimestamp: number): number {
    if (utcTimestamp) {
      try {
        const localDateTime = addMinutes(utcTimestamp, -(new Date().getTimezoneOffset()));
        return localDateTime.getTime();
      } catch (e) {
        // console.log(e);
      }
    }
    return 0;
  }

  static getYYYYMMDD(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'yyyy-MM-dd');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  static getDateAndTime(date: string, formatType?): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        if (formatType) {
          return format(localDate, formatType);
        } else {
          return format(localDate, 'DD-MMM-YYYY hh:mm:a');
        }
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getLastWeek() {
    return subWeeks(new Date(), 1);
  }

  static getStartOfThisMonth() {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setDate(1);
    today.setHours(0);
    return new Date(today);
  }

  static getEndOfThisMonth() {
    const today = new Date();
    today.setMinutes(23);
    today.setSeconds(0);
    today.setHours(0);
    return new Date(today);
  }

  static getStartOfThisWeek() {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    const day = today.getDay(),
      diff = today.getDate() - day + (day === 0 ? -6 : 0); // adjust when day is sunday
    return new Date(today.setDate(diff));
  }

  static getStartOfLastWeek() {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    const day = today.getDay(),
      diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(today.setDate(diff));
  }


  static getStartOfPrevWeek() {
    // const today = new Date();
    const firstDay = this.getLastWeek();
    firstDay.setMinutes(0);
    firstDay.setSeconds(0);
    firstDay.setHours(0);
    return firstDay;
    // const day = today.getDay(),
    //   diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    // return new Date(firstDay.setDate(diff));
  }

  static getEndofPrevWeek() {
    let firstDay = this.getLastWeek();
    firstDay.setMinutes(0);
    firstDay.setSeconds(0);
    firstDay.setHours(0);
    firstDay = addDays(firstDay, 6);
    return new Date(firstDay);
  }



  static getStartOfPrevMonth() {
    const firstDay = this.getLastMonth();
    firstDay.setMinutes(0);
    firstDay.setSeconds(0);
    firstDay.setDate(1);
    firstDay.setHours(0);
    return new Date(firstDay);
  }


  static getEndofPrevMonth() {
    const firstDay = this.getLastMonth();
    return new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
  }


  static getLastMonth() {
    return subMonths(new Date(), 1);
  }

  static getLastDay() {
    return subDays(startOfToday(), 1);
  }

  static getEndOfYesterday() {
    return endOfYesterday();
  }

  static getStartofToday() {
    return startOfToday();
  }

  static getEndofToday() {
    return endOfToday();
  }

  static getUtcDateTimeStart(date: string) {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, (new Date().getTimezoneOffset()));
        return format(localDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getUtcDateToYYYYMMDDHHmmSS(date: any) {
    if (date) {
      try {
        const utcDate = new Date(Date.parse(date));
        const localDate = addMinutes(utcDate, (new Date().getTimezoneOffset()));
        return format(localDate, 'yyyy-MM-dd HH:mm:ss')
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  }

  static getUtcDateTimeStart22(date: any) {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, (new Date().getTimezoneOffset()));
        return format(localDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getLocalDateTimeStart(date: string) {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        return format(utcDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getUtcDateTimeEnd(date: string) {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const resultDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(resultDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        // console.log(e);
      }
    }
    return '';
  }

  static getDuration(time?) {
    // if (time >= 60) {
    //   const hours = Number(Math.trunc(time / 60));
    //   const mins = Number(Math.trunc(time % 60));
    //   return hours + 'H ' + ' ' + mins + 'M';
    // } else if (time < 60) {
    //   return (time).toFixed(2) + 'M';
    // } else {
    //   return 0 + 'H ' + 0 + 'M';
    // }


    time = Number(time);
    var h = Math.floor(time / 3600);
    var m = Math.floor(time % 3600 / 60);
    var s = Math.floor(time % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "H " : "H ") : "0H ";
    var mDisplay = m > 0 ? m + (m == 1 ? "M " : "M ") : "0M ";
    var sDisplay = s > 0 ? s + (s == 1 ? "S" : "S") : "0S";
    return hDisplay + mDisplay + sDisplay;
  }

  static getHoursFromMinutes(time?) {
    if (time) {
      let hours = (time / 60).toFixed(1);
      return hours;
    }
  }

  static sortDates(dates) {
    dates.sort(function (a, b) {
      let number: any;
      var dateA = +new Date(a);
      var dateB = +new Date(b);
      number = (dateA - dateB);
      return number;
    });
  }

  static DifferenceInYears(date1, date2) {
    const _MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
    if (!!(date1) && !(date2)) {
      let a = new Date(date1);
      let b = new Date(date2);
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      // // console.log(utc1, utc2, utc1 - utc2);
      let timeDiff = Math.floor((utc1 - utc2) / _MS_PER_YEAR);
      return timeDiff;
    }
  }

  static DifferenceInMints(date1, date2) {
    let duration = moment.duration(date2.diff(date1));
    var min = duration.asSeconds();
    return min;
  }

  static getUTCTime(datetime: any) {
    if (datetime) {
      try {
        const curr = format(new Date(), 'dd MMM yyyy');
        const utcDate = new Date(datetime + ' ' + curr);
        const localDate = addMinutes(utcDate.getTime(), (new Date().getTimezoneOffset()));
        return format(localDate, 'HH:mm:ss');
        // return format(localDate, 'yyyy-MM-dd HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  static getLocalTime(datetime: any) {
    if (datetime) {
      try {
        const curr = format(new Date(), 'dd MMM yyyy');
        const utcDate = new Date(datetime + ' ' + curr);
        let newDate = subMinutes(utcDate.getTime(), new Date().getTimezoneOffset());
        // const localDate = addMinutes(utcDate.getTime(), (new Date().getTimezoneOffset()));
        // console.log(format(newDate, 'yyyy-MM-dd HH:mm:ss'));
        return format(newDate, 'HH:mm:ss');
        // return format(localDate, 'yyyy-MM-dd HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  static convertUTCtoLocalDatetime(datetime: any) {
    if (datetime) {
      const dt = new Date(datetime);
      let newDate = new Date(dt.getTime() + dt.getTimezoneOffset());

      return format(newDate, 'HH:mm:ss dd-MM-yyyy');
    }
  }
}
