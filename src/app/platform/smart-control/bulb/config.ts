import {  environment } from "src/environments/environment";

// export class bulbFormConfig {
//     public static config = {
//         title: '',
//         layout: 'row wrap',
//         showTimeInterval: false,
//         columns: [
//             {
//                 name: 'buildings', title: '', type: 'dropdown', placeholder: 'Select Building', clearable: true,
//                 options: []
//             },
//             {
//                 name: 'area', title: '', type: 'dropdown', placeholder: 'Select Area',
//                 options: [{ id: 1, name: 'By Floor' }, { id: 2, name: 'By Open Area' }], default: 'By Floor'
//             },
//             {
//                 name: 'floor', title: '', type: 'dropdown', placeholder: 'Select Floor',
//                 options: []
//             },
//             {
//                 name: 'space', title: '', type: 'dropdown', placeholder: 'Select Space', options: []
//             },
//             {
//                 name: 'room', title: '', type: 'dropdown', placeholder: 'Select Room',
//                 options: []
//             }
//         ],
//         actions: []
//     }
// }

export class bulbTableConfig {
    public static config = {
        
        title: 'Bulb',
        slug: `${environment.baseUrlSB}/building/smart_devices/?`,

        showHeader:false,
        showCSVTool: true,
        search: true,
        showRowActions: true,
        doApiCall: false,
        exportOutside: true,
        acColumnWidth: '164px',

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            // { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'device_name', title: 'Device Name', sortable: true, sortingOutside: true, visible: true , clickable: true, action: 'BulbDetail',   showImage: true,   imageUrl: '/assets/images/bulb.jpg'},
            { name: 'building_name', title: 'Building', sortable: true, sortingOutside: true, visible: true},
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: true, visible: true},
            { name: 'open_area_name', title: 'Open Area', sortable: true, sortingOutside: true, visible: true},
            { name: 'space_name', title: 'Space', sortable: true, sortingOutside: true, visible: true},
            { name: 'space_attribute_name', title: 'Room', sortable: true, sortingOutside: true, visible: true},
            { name: 'device_online', title: 'Status', showValue: false, sortable: true, sortingOutside: true, format: 'status', statusButton: true, action: 'onStatusChange' },

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

export const STATUS: any = (v: any, r?: any, c?: any) => status(v, r, c);
