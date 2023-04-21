import { id } from "date-fns/locale";
import { environment } from "src/environments/environment";


//////// Table config ///////////////
export class livefeedTableConfig {
    public static config = {
        title: 'LiveFeed',     
        addBtnText: '', //Add Device
        optionalBtnIcon: 'ri-upload-line',
        showHeader: false,
        showCSVTool: false,
        search: false,
        showRowActions: true,
        doApiCall: false,
        acColumnWidth: '164px',

        rowActions: [
            // { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit', btnColor: 'btn-primary' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
             {name: 'id', title: 'VIEWS', visible : true,sortable: true},
            { name: 'name', title: 'CAMERAS', sortable: true,  visible: true, },
            // { name: 'video', title: 'VIDEOS', sortable: true, visible: true,  },
         ]
    }
}
