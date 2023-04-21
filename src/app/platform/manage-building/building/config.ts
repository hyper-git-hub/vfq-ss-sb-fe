import { environment } from "src/environments/environment"

export class BuildingTableConfig {
    public static config = {
        title: 'Building',
        slug: `${environment.baseUrlSB}/building/?`,
        addBtnText: '',

        showHeader: false,
        showAdd: false,
        showRowActions: true,
        doApiCall: false,
        showCSVTool: true,
        respOutside: true,
        paginationOutside: true,
        searchInSide: true,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-settings-line', type: 'icon', tooltip: 'Setting', action: 'onSetting', btnColor: 'btn-warning' }
        ],

        columns: [
            { name: 'id', title: 'ID', visible: true },
            { name: 'name', title: 'Building Name', sortable: true, sortingOutside: true, clickable: true, action: 'onBuildingId' },
            { name: 'type', title: 'Buildin Type', sortable: true, sortingOutside: true },
            { name: 'floors', title: 'Floor', sortable: true, sortingOutside: true, isLoop: true, makeOvals: true, item_name: 'name' },
            // { name: 'open_area', title: 'Open Area', sortable: true, sortingOutside: true },
            { name: 'address', title: 'Location', sortable: true, sortingOutside: true },
        ]
    }
}



export class buildingFormTableConfig {
    public static config = {
        title: '',
        slug: '',
        addBtnText: '',

        showHeader: false,
        showAdd: false,
        showRowActions: true,
        doApiCall: false,
        showPagination: false,
        searchOptions: [],
        showSubHeader: false,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEditFloor' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDeleteFloor', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'name', title: 'Floor', sortable: false, clickable: false }

        ]
    }
}


export class openSpaceFormTableConfig {
    public static config = {
        title: '',
        slug: '',
        addBtnText: '',

        showHeader: false,
        showAdd: false,
        showRowActions: true,
        doApiCall: false,
        showPagination: false,
        searchOptions: [],
        showSubHeader: false,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEditOpenArea' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDeleteOpenArea', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'name', title: 'Open Area', sortable: false, clickable: false }
        ]
    }
}

export class spaceFormTableConfig {
    public static config = {
        title: '',
        slug: '',
        addBtnText: '',

        showHeader: false,
        showAdd: false,
        showRowActions: true,
        doApiCall: false,
        showPagination: false,
        searchOptions: [],
        showSubHeader: false,
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEditSpace' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDeleteSpace', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'name', title: 'Space', sortable: false, clickable: false }
        ]
    }
}