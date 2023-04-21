import { apiIdentifier } from "src/environments/environment";


export class bulbDetailTableConfig {
    public static config = {
        title: 'Bulb Schedules',
        // slug: `${apiIdentifier.monolith}/manage-camera`,

        showHeader:false,
        showCSVTool: true,
        search: true,
        showRowActions: true,
        doApiCall: false,
        exportOutside: true,
        acColumnWidth: '164px',

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'name', title: 'Schedule Name', sortable: true, sortingOutside: true, sortColumn: 'schedule_name'  },
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/bulb.jpg' },
            { name: 'state', title: 'Schedule Status', sortable: true, sortingOutside: true  },
            { name: 'building_name', title: 'Building', sortable: true, sortingOutside: true },
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: true },
            { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: true },
            { name: 'start_time', title: 'Start Time', sortable: true, sortingOutside: true, format: 'timeutc' },
            { name: 'end_time', title: 'End Time', sortable: true, sortingOutside: true, format: 'timeutc' },
            { name: 'days', title: 'Days', sortable: true, sortingOutside: true, format: 'schedule-days' },
        ]
    }
}


function status(v: any, r?: any, c?: any): any
{
    if (['1', 1].includes(r.status))
    {
        return `<span class="label label-success">Active</span>`;
    } else {
        return `<span class="label label-danger">In-active</span>`;
    }
}

function setScheduleDays(v: any, r?: any, c?: any): any {
    if (r.days) {
        const d = r.days.split(',');
        let ds: string[] = [];
        d.forEach(d => {
            if (d == 0) {
                ds.push('Mon');
            } else if ( d == 1) {
                ds.push('Tue');
            } else if ( d == 2) {
                ds.push('Wed');
            } else if ( d == 3) {
                ds.push('Thu');
            } else if ( d == 4) {
                ds.push('Fri');
            } else if ( d == 5) {
                ds.push('Sat');
            } else if ( d == 6) {
                ds.push('Sun');
            }
        });

        return ds.join(',');
    }
}

export const STATUS: any = (v: any, r?: any, c?: any) => status(v, r, c);
export const SCHEDULEDAYS: any = (v: any, r?: any, c?: any) => setScheduleDays(v, r, c);
