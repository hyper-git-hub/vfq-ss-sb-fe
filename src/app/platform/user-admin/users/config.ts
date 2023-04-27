import {  environment } from "src/environments/environment";

export class userFormConfig {
    public static config = {
        title: '',
        layout: 'row wrap',
        flexGap: '37px',
        showTimeInterval: false,
        columns: [
            {
                name: 'Time interval', title: 'Radio Buttons', type: 'radio', flex: '100%',
                options: [{ id: 1, value: 'today', label: "Current Day" }, 
                { id: 2, value: 'week', label: 'Previous Week' }, 
                { id: 3, value: 'month', label: 'Previous Month' },
                 { id: 4, value: 'period', label: 'Select a Perioud' }],
            },
            {
                name: 'start', title: '', type: 'date', placeholder: 'Select Start Date'

            },
            {
                name: 'end', title: '', type: 'date', placeholder: 'Select End Date'

            },
        ],
        actions: []
    }
}
export class UserTableConfig {

    private static onlyChildUser = (row) =>
    {
        const user: any = JSON.parse(localStorage.getItem('user'));
        return  user.guid !== row.guid  &&  row.user_type == 2 ;
    }

    public static config = {
        title: 'Users',
        slug: `${environment.baseUrlUser}/users/user-listing?usecase_id=5&`,
        addBtnText: 'Add New User',

        showHeader: false,
        showSubHeader:true,
        showRowActions: true,
        showCSVTool:true,
        search:true,
        showtime:false,
        selectionEnabeled: false,
        doApiCall: false,
        acColumnWidth: '110px',
        searchOptions: ['name', 'email', 'phone_no', 'total_devices', 'status'],
        
        // condition: UserTableConfig.onlySuperAdmin
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit', condition: UserTableConfig.onlyChildUser },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger',
                condition: UserTableConfig.onlyChildUser  },
            // { icon: 'ri-settings-line', type: 'icon', tooltip: 'Setting', action: 'onSetting', btnColor: 'btn-warning' }
            { icon: 'ri-settings-line', type: 'icon', tooltip: 'Setting', action: 'onChangeStatus', btnColor: 'btn-warning',
                condition: UserTableConfig.onlyChildUser  }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'first_name', title: 'First Name', sortable: true, clickable: false },
            { name: 'last_name', title: 'Last Name', visible: true  , sortable: true},
            { name: 'email', title: 'EMAIL', sortable: true },
            { name: 'department', title: 'Department', sortable: true },
            { name: 'work_location', title: 'Work Location', sortable: true },
            { name: 'group', title: 'Group', sortable: false },
            { name: 'date_joined', title: 'Date Joined', sortable: true ,format: 'date' },
            { name: 'internal_role', title: 'Role', sortable: false },
            { name: 'status', title: 'Status', sortable: true ,format: 'status'},
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
