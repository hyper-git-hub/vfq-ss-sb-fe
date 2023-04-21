import { environment } from "src/environments/environment"

export class OccupancyTimeFormConfig {
    public static config = {
        title: 'Select Parameters',
        layout: 'row wrap',
        showTimeInterval: true,
        columns: [
            {
                name: 'time_interval', title: 'Radio Buttons', type: 'radio', flex: '100',
                options: [
                    { id: 1, value: 'today', label: "Current Day" },
                    { id: 2, value: 'last_week', label: 'Previous Week' },
                    { id: 3, value: 'last_month', label: 'Previous Month' },
                    { id: 4, value: 'period', label: 'Select a Period' }
                ],
            },
            { name: 'start', title: '', type: 'date', placeholder: 'Start Date', clearable: true, flex: '20' },
            { name: 'end', title: '', type: 'date', placeholder: 'End Date', clearable: true, flex: '20' },
        ]
    }
}


export class OccupancyTableConfig {
    public static config = {
        title: 'Occupancy',
        slug: `${environment.baseUrlSB}/building/smart_devices/`,
        addBtnText: 'Add New Occupancy',

        showHeader: false,
        showRowActions: true,
        doApiCall: true,
        searchInSide: true,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            // { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: false },
            { name: 'building_name', title: 'Building Name', sortable: true, sortingOutside: false },
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: false },
            { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: false },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: false },
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: false },
            { name: 'overflow', title: 'Overflow Range', sortable: true, sortingOutside: false },
            { name: 'underflow', title: 'Underflow Range', sortable: true, sortingOutside: false },
            { name: 'device_online', title: 'Status' },
        ]
    }
}