export class OccupancyTableConfig {
    public static config = {
        title: 'Consumer',
        slug: 'cobnewconsumer/consumer/',
        addBtnText: 'Add New Consumer',

        showHeader: false,
        showAdd: true,
        showRowActions: true,
        doApiCall: false,
        searchOptions: ['name', 'email', 'phone_no', 'total_devices', 'status'],
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'name', title: 'DEVICE NAME', sortable: true, clickable: true },
            { name: 'type', title: 'BUILDING TYPE', sortable: true },
            { name: 'floor', title: 'FLOOR', sortable: true },
            { name: 'space', title: 'SPACE', sortable: true },
            { name: 'room', title: 'ROOM', sortable: true },
            { name: 'overflow', title: 'OVERFLOW RANGE', sortable: true },
            { name: 'underflow', title: 'UNDERFLOW RANGE', sortable: true },
            { name: 'status', title: 'status' },
        ]
    }
}
export class GeoZoneTableConfig {
    public static config = {
        title: 'Consumer',
        slug: 'cobnewconsumer/consumer/',
        addBtnText: 'Add New Consumer',

        showHeader: false,
        showAdd: true,
        showRowActions: true,
        doApiCall: false,
        searchOptions: ['name', 'email', 'phone_no', 'total_devices', 'status'],
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'name', title: 'DEVICE NAME', sortable: true, clickable: true },
            { name: 'type', title: 'BUILDING TYPE', sortable: true },
            { name: 'floor', title: 'FLOOR', sortable: true },
            { name: 'space', title: 'SPACE', sortable: true },
            { name: 'room', title: 'ROOM', sortable: true },
            { name: 'overflow', title: 'OVERFLOW RANGE', sortable: true },
            { name: 'underflow', title: 'UNDERFLOW RANGE', sortable: true },
            { name: 'status', title: 'status' },
        ]
    }
}