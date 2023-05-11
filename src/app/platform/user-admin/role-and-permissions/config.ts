import { environment } from "src/environments/environment";
export class RoleTableConfig {
    private static writeCondition(row: any) {
        const u: any = JSON.parse(localStorage.getItem('user'));
        return u.write == true;
    }

    public static config = {
        title: 'Role & Access',
        slug: `${environment.baseUrlRA}/api/role-and-access/group?use_case_id=5&`,
        addBtnText: 'Add New Consumer',


        showHeader: false,
        showSubHeader:true,
        showCSVTool:true,
        search:true,
        showAdd: true,
        showRowActions: true,
        paginationOutside: false,
        doApiCall: false,
        acColumnWidth: '110px',
        searchOptions: ['name', 'email', 'phone_no', 'total_devices', 'status'],

    
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit', condition: RoleTableConfig.writeCondition },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger', condition: RoleTableConfig.writeCondition },
            { icon: 'ri-settings-line', type: 'icon', tooltip: 'Setting', action: 'onSetting', btnColor: 'btn-warning', condition: RoleTableConfig.writeCondition }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'name', title: 'GROUP', sortable: true, clickable: false ,sortingOutside: false, sortColumn: 'group' },
            { name: 'description', title: 'DESCRIPTION', sortable: true ,sortingOutside: false,},
            { name: 'group_user_count', title: 'USERS', sortable: true,sortingOutside: false,sortColumn: 'users' },
           
        ]
    }
}