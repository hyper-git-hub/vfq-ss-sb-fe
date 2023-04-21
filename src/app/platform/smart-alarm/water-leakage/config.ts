import {  environment } from "src/environments/environment";


export class waterLeakageTableConfig {
    public static config = {
        title: 'Water Leakage',
        slug: `${environment.baseUrlSB}/building/smart_devices/`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        showRowActions: true,
        doApiCall: true,
        searchInSide: true,
        paginationOutside: false,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            // { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            {
                name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: false, sortColumn: 'device_name', clickable: true, action: 'onDeviceID', showImage: true,
                imageUrl: '/assets/images/Smoke_detector.jpg'
            },
            { name: 'building_name', title: 'Building', sortable: true, sortingOutside: false },
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: false },
            { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: false },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: false },
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: false },
            // { name: 'device_online', title: 'Status', showValue: false, sortable: true, statusButton: true, action: 'onStatusChange' },
        ]
    }
}

