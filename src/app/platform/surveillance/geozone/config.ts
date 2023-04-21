import { apiIdentifier, environment } from "src/environments/environment";
export class geozoneTableConfig {
    public static config = {
        title: 'Geozone',
        slug: `${environment.baseUrlSB}/building/smart_devices/?`,  //change according to geozone list api 
        addBtnText: 'Add new Geozone',

        showHeader: false,
        showRowActions: false,
        searchInSide: true,
        doApiCall: true,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],
        columns: [
            { name: 'device_name', title: 'Camera Name', sortable: true, sortColumn: 'device_name' ,sortingOutside: false},
            { name: 'building_name', title: 'Building', sortable: true,sortingOutside: false },
            { name: 'floor_name', title: 'Floor', sortable: true, sortingOutside: false },
            { name: 'open_area_name', title: 'Open Area', sortable: true ,sortingOutside: false},
            { name: 'space_name', title: 'Space', sortable: true,sortingOutside: false },
            { name: 'space_attribute_name', title: 'Room', sortable: true,sortingOutside: false },
            // { name: 'device_online', title: 'Status', showValue: false, statusButton: true, action: 'onStatusChange' },
        ]
    }
}