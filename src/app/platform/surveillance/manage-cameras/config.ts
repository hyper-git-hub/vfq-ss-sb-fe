import { apiIdentifier, environment } from "src/environments/environment";

export class manageCameraFormConfig {
    public static config = {
        title: '',
        layout: 'row wrap',
        showTimeInterval: false,
        columns: [
            {
                name: 'buildings', title: '', type: 'dropdown', placeholder: 'Select building', clearable: true,
                options: [{ id: 1, name: 'Building 1' }, { id: 2, name: 'Building 2' }], default: 'Building 1'
            },
            {
                name: 'area', title: '', type: 'dropdown', placeholder: 'Select area',
                options: [{ id: 1, name: 'By Floor' }, { id: 2, name: 'By Open Area' }], default: 'By Floor'
            },
            {
                name: 'floor', title: '', type: 'dropdown', placeholder: 'Select floor',
                options: [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }], default: 'Floor 1'
            },
            {
                name: 'space', title: '', type: 'dropdown', placeholder: 'Select space',
                options: [{ id: 1, name: 'Space 1' }, { id: 2, name: 'Space 2' }], default: 'Space 1'
            }
        ],
        actions: []
    }
}

export class manageCameraTableConfig {
    public static config = {
        title: 'ManageCamera',
        slug: `${environment.baseUrlSB}/building/smart_devices/?device_type=${'camera'}&`,

        showHeader: false,
        showCSVTool: true,
        search: true,
        searchInSide: true,
        showRowActions: true,
        doApiCall: false,
        

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            // { icon: 'ri-settings-2-line', type: 'icon', tooltip: 'Setting', action: 'onSetting', btnColor: 'btn-warning' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'device_name', title: 'Camera Name', sortable: true, sortingOutside: true, sortColumn: 'device_name' },
            { name: 'camera_ip', title: 'Camera IP', sortable: false, showValue: true, value: '51.144.150.199' },
            { name: 'status', title: 'Status', sortable: true, sortingOutside: true, format: 'status' },
            { name: 'building_name', title: 'Building', sortable: true, sortingOutside: true },
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: true },
            { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true },
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: true },
            { name: 'motion', title: 'Motion Alert Status', sortable: true, sortingOutside: true, format: 'motion-status' },
            // { name: 'device_online', title: 'Status', showValue: false, statusButton: true, action: 'onStatusChange' },
        ]
    }
}


function status(v: any, r?: any, c?: any): any
{
    if (['1', 1].includes(r.status)) {
        return `<span>Active</span>`;
    } else {
        return `<span>In-active</span>`;
    }
}
function mStatus(v: any, r?: any, c?: any): any
{
    if (r.motion) {
        return `<span>Enabled</span>`;
    } else {
        return `<span>Disabled</span>`;
    }
}

export const STATUS: any = (v: any, r?: any, c?: any) => status(v, r, c);
export const MSTATUS: any = (v: any, r?: any, c?: any) => mStatus(v, r, c);