import { environment } from "src/environments/environment";

export class socketTableConfig {
    public static config = {
        title: 'ManageCamera',
        slug: `${environment.baseUrlSB}/building/smart_devices/`,
        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: true,
        doApiCall: true,
        acColumnWidth: '164px',

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            {
                name: 'device_name', title: 'Device Name', sortable: true, sortColumn: 'device_name', clickable: true, action: 'onDeviceID', showImage: true,
                imageUrl: '/assets/images/socket.jpg'
            },
            { name: 'building_name', title: 'Building', sortable: true },
            { name: 'floor_name', title: 'Floor', sortable: true },
            { name: 'open_area_name', title: 'Open Area', sortable: true },
            { name: 'space_name', title: 'Space', sortable: true },
            { name: 'space_attribute_name', title: 'Room', sortable: true },
            { name: 'device_online', title: 'Status', showValue: false, statusButton: true, action: 'onStatusChange' },
        ]
    }
}