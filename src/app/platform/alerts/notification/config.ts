import { environment } from "src/environments/environment"

export class NotificationsTableConfig {
    public static config = {
        title: 'Notifications',
        // slug: `${environment.fleetBaseURL}/api/notification?`,
        addBtnText: 'Add Notification',

        showHeader: false,
        showSubHeader:false,
        showRowActions: false,
        paginationOutside: true,
        doApiCall: false,

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID', visible: false },
            { name: 'notf_title', title: 'Title', sortable: true },
            { name: 'notf_body', title: 'Body', sortable: true },
            { name: 'alert_type', title: 'Type', sortable: true },
            { name: 'notf_created_at', title: 'Last Updated', sortable: true , format: 'datetime'},
            { name: 'device_id', title: 'Device', sortable: true },
        ]
    }
}

