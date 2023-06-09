import { environment } from "src/environments/environment";

export class reportFilterFormConfig {
    public static config = {
        title: '',
        layout: 'row wrap',
        flexGap: '37px',
        showTimeInterval: false,
        columns: [
            {
                name: 'time_Interval', title: 'Radio Buttons', type: 'radio', flex: '100%',
                options: [{ id: 1, value: 'today', label: "Current Day" }, 
                { id: 2, value: 'week', label: 'Previous Week' }, 
                { id: 3, value: 'month', label: 'Previous Month' },
                 { id: 4, value: 'period', label: 'Select a Period' }],
            },
            {
                name: 'start', title: '', type: 'date', placeholder: 'Select Start Date'

            },
            {
                name: 'end', title: '', type: 'date', placeholder: 'Select End Date'

            },
        ],
        actions: []
    }
}

export class socketsPCTableConfig {
    public static config = {
        title: 'Socket Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'average_consumption', title: 'Average Power Consumption', sortable: true, sortingOutside: true },
        ]
    }
}

export class emPCTableConfig {
    public static config = {
        title: 'Energy Meter Power Consumption',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'average_consumption', title: 'Average Consumption', sortable: true, sortingOutside: true },
        ]
    }
}
export class waterPCTableConfig {
    public static config = {
        title: 'Water Power Consumption Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true },
            { name: 'average_consumption', title: 'Avg Water Consumption', sortable: true, sortingOutside: true },
        ]
    }
}
export class smokeAlertTableConfig {
    public static config = {
        title: 'Smoke Alert Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true },
            { name: 'status', title: 'Status', sortable: true, sortingOutside: true, sortColumn: 'online_status' },
        ]
    }
}
export class waterLeakageTableConfig {
    public static config = {
        title: 'Water Leakage Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true },
            { name: 'status', title: 'Status', sortable: true, sortingOutside: true, sortColumn: 'online_status' },
        ]
    }
}
export class temperatureTableConfig {
    public static config = {
        title: 'Temperature Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'average_temperature', title: 'Average Temp', sortable: true, sortingOutside: true, format: 'round-temp' },
            { name: 'average_humidity', title: 'Average Humidity', sortable: true, sortingOutside: true, format: 'round-hum' },
        ]
    }
}

function roundTemp(v: any, r?: any, c?: any): any {
    if (!!r.average_temperature) {
        let t = +r.average_temperature;
        return t.toFixed(2);
    }
}

function roundHum(v: any, r?: any, c?: any): any {
    if (!!r.average_humidity) {
        let hum = +r.average_humidity;
        return hum.toFixed(2);
    }
}

export const ROUNDTEMP: any = (v: any, r?: any, c?: any) => roundTemp(v, r, c);
export const ROUNDHUM: any = (v: any, r?: any, c?: any) => roundHum(v, r, c);


export class cameraStatusTableConfig {
    public static config = {
        title: 'Camera Status Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'status', title: 'Status', sortable: true, sortingOutside: true, sortColumn: 'online_status' },
        ]
    }
}
export class fvTableConfig {
    public static config = {
        title: 'Footage Viewer Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'live_viewers', title: 'Live Viewers', sortable: true, sortingOutside: true },
            { name: 'placyback_viewers', title: 'Playback Viewers', sortable: true, sortingOutside: true },
        ]
    }
}
export class fdTableConfig {
    public static config = {
        title: 'Footage Download Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'total_downloads', title: 'Total Downloads', sortable: true, sortingOutside: true },
        ]
    }
}
export class wtTableConfig {
    public static config = {
        title: 'Watch Time Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'live_stream_watch_time', title: 'Live Streaming Watch Time', sortable: true, sortingOutside: true },
            { name: 'playback_watch_time', title: 'Playback Watch Time', sortable: true, sortingOutside: true },
        ]
    }
}
export class gmAlertTableConfig {
    public static config = {
        title: 'Geozone Motion Alerts Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'alert_datetime', title: 'Motion Date Time', sortable: true, sortingOutside: true },
            { name: 'link', title: 'Link', sortable: true, sortingOutside: true },
        ]
    }
}

export class alertsEventsTableConfig {
    public static config = {
        title: 'Alerts & Event Trigger Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'alert_datetime', title: 'Alert Date Time', sortable: true, sortingOutside: true },
        ]
    }
}
export class occupancyTableConfig {
    public static config = {
        title: 'Occupancy Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'building_type', title: 'Building Type', sortable: true, sortingOutside: true },
            { name: 'floor_or_open_area_name', title: 'Floor/Open Area', sortable: true, sortingOutside: true },
            // { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'room_name', title: 'Room', sortable: true, sortingOutside: true, sortColumn: 'room_name' },
            { name: 'occupancy_status', title: 'Occupancy Status', sortable: true, sortingOutside: true },
        ]
    }
}
export class userActivityTableConfig {
    public static config = {
        title: 'User Activity Reports',
        slug: `${environment.baseUrlDashboard}/report`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: false,
        doApiCall: true,

        columns: [
            { name: 'user_name', title: 'User Name', sortable: true, sortingOutside: true, showImage: true, imageUrl: '/assets/images/device.jpg' },
            { name: 'login_datetime', title: 'Login Date Time', sortable: true, sortingOutside: true },
            { name: 'camera_viewed', title: 'Camera Viewed', sortable: true, sortingOutside: true },
            { name: 'start_time', title: 'Start Date Time', sortable: true, sortingOutside: true },
            { name: 'end_time', title: 'End Date Time', sortable: true, sortingOutside: true },
        ]
    }
}