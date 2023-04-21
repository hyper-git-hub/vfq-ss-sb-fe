import { environment } from "src/environments/environment"

export class SmokeAlertsTableConfig {
    public static config = {
        title: 'Smoke Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: true, action: "somokeDetail" },
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            // { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            // { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }
        ]
    }
}
export class WaterLeakageTableConfig {
    public static config = {
        title: 'Water Leakage Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: true, action: "waterleakageDetail" },
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            // { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            // { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }
        ]
    }
}
export class OccupancyTableConfig {
    public static config = {
        title: 'Occupancy Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: false,},
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }
        ]
    }
}
export class TemperatureTableConfig {
    public static config = {
        title: 'Temperature Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: true, action: "temperatureDetail" },
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }
        ]
    }
}
export class GeozoneTableConfig {
    public static config = {
        title: 'Geozone Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: false,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: false, action: "deviceDetail" },
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            // { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            // { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }

        ]
    }
}
export class HumidityTableConfig {
    public static config = {
        title: 'Humidity Alerts',
        slug: `${environment.baseUrlNotif}/alert/`,

        showHeader: false,
        showSubHeader: true,
        showRowActions: true,
        searchInSide: true,
        doApiCall: true,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'device_id', title: 'Device Name', sortable: true, sortingOutside: false, clickable: true, action: "temperatureDetail" },
            { name: 'alert_name', title: 'Alert Name', sortable: true, sortingOutside: false },
            { name: 'upper_threshold', title: 'Upper Threshold', sortable: true, sortingOutside: false },
            { name: 'lower_threshold', title: 'Lower Threshold', sortable: true, sortingOutside: false },
            { name: 'updated_at', title: 'Alert Date Time', format: 'datetime' }
        ]
    }
}

