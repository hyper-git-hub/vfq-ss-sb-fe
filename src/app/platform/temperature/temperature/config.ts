import { environment } from "src/environments/environment";

export class temperatureTableConfig {
    public static config = {
        title: 'Temperature',
        slug: `${environment.baseUrlSB}/building/smart_devices/`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,
        paginationOutside: false,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        
        columns: [
            {
                name: 'device_name', title: 'Device Name', sortable: true, sortColumn: 'device_name', sortingOutside: false, clickable: true, action: 'onDeviceID', showImage: true,
                imageUrl: '/assets/images/device.jpg'
            },
            { name: 'building_name', title: 'Building', sortable: true , sortingOutside: false},
            { name: 'floor_name', title: 'Floor', sortable: true,sortingOutside: false },
            { name: 'open_area_name', title: 'Open Area', sortable: true ,sortingOutside: false},
            { name: 'space_name', title: 'Space', sortable: true,sortingOutside: false },
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: false },
            { name: 'temperature', title: 'Last updated temperature', sortable: true, format: 'round-temp' },
            { name: 'humidity', title: 'Last updated humidity', sortable: true, format: 'round-hum' },
            // { name: 'device_online', title: 'Status', showValue: false, sortable: true, statusButton: true, action: 'onStatusChange' },
        ]
    }
}


function roundTemp(v: any, r?: any, c?: any): any {
    if (!!r.temperature) {
        let t = +r.temperature;
        return t.toFixed(2);
    }
}

function roundHum(v: any, r?: any, c?: any): any {
    if (!!r.humidity) {
        let hum = +r.humidity;
        return hum.toFixed(2);
    }
}

export const ROUNDTEMP: any = (v: any, r?: any, c?: any) => roundTemp(v, r, c);
export const ROUNDHUM: any = (v: any, r?: any, c?: any) => roundHum(v, r, c);
