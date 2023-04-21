import { apiIdentifier, environment } from "src/environments/environment";

export class auditTableConfig {
    public static config = {
        title: 'Audit',
        slug: `${environment.baseUrlAudit}/api/audit?use_case_id=5&`,
        addBtnText: '', //Add Device

        showHeader: false,
        showCSVTool: true,
        search: false,
        showRowActions: false,
        doApiCall: false,
        acColumnWidth: '164px',
        searchInSide: false,

        rowActions: [
            // { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            // { icon: 'ri-settings-2-line', type: 'icon', tooltip: 'Setting', action: 'onSetting', btnColor: 'btn-warning' },
            // { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'ID' },
            { name: 'type_name', title: 'Entity', sortable: true, sortColumn: 'type' },
            { name: 'action_name', title: 'Action', sortable: true, sortColumn: 'action' },
            { name: 'action_details', title: 'Action Details', sortable: true },
            { name: 'action_date', title: 'Action Date', format: 'date', sortable: true },
            { name: 'action_time', title: 'Action Time', format: 'timeutc', sortable: true },
            { name: 'action_by', title: 'Action By', sortable: true },
            // { name: 'status', title: 'Status', format: 'status_format' },
        ]
    }
}