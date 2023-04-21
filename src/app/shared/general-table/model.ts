export class TableConfig {
    title: string = '';
    slug: string = '';
    addBtnText: string;
    optionalBtnText: string;
    optionalBtnIcon: string;
    acColumnWidth: string;
    searchKey: string;

    showHeader: boolean;
    showSubHeader: boolean;
    showSearch: boolean;
    showSearchFilters: boolean;
    searchInSide: boolean;
    showAdd: boolean;
    showOptionalBtn: boolean;
    showDownload: boolean;
    showTable: boolean;
    showRowActions: boolean;
    showPagination: boolean;
    paginationOutside: boolean;
    doApiCall: boolean;
    selectionEnabeled: boolean;
    showCSVTool: boolean;
    search: boolean;
    exportOutside: boolean;
    respOutside: boolean;
    multiSort: boolean;

    searchOptions: any[];

    columns: TableColumn[];
    rowActions: TableRowAction[];

    constructor(params?: any) {
        this.title = params?.title === void 0 ? '' : params.title;
        this.slug = params?.slug === void 0 ? '' : params.slug;
        this.addBtnText = params?.addBtnText === void 0 ? `Add ${this.title}` : params.addBtnText;
        this.optionalBtnText = params?.optionalBtnText;
        this.optionalBtnIcon = params?.optionalBtnIcon;    
        this.searchKey = params?.searchKey === void 0 ? 'search' : params.searchKey;
        this.search = params?.search === void 0 ? true : params.search;
        this.showHeader = params?.showHeader === void 0 ? true : params.showHeader;
        this.showSubHeader = params?.showSubHeader === void 0 ? true : params.showSubHeader;
        this.showSearch = params?.showSearch === void 0 ? true : params.showSearch;
        this.showSearchFilters = params?.showSearchFilters === void 0 ? false : params.showSearchFilters;
        this.searchInSide = params?.searchInSide === void 0 ? false : params.searchInSide;
        this.showAdd = params?.showAdd === void 0 ? true : params.showAdd;
        this.showOptionalBtn = params?.showOptionalBtn === void 0 ? false : params.showOptionalBtn;
        this.showDownload = params?.showDownload === void 0 ? true : params.showDownload;
        this.showTable = params?.showTable === void 0 ? true : params.showTable;
        this.showRowActions = params?.showRowActions === void 0 ? false : params.showRowActions;
        this.showPagination = params?.showPagination === void 0 ? true : params.showPagination;
        this.paginationOutside = params?.paginationOutside === void 0 ? true : params.paginationOutside;
        this.doApiCall = params?.doApiCall === void 0 ? true : params.doApiCall;
        this.showCSVTool = params?.showCSVTool === void 0 ? true : params.showCSVTool;
        this.selectionEnabeled = params?.selectionEnabeled === void 0 ? false : params.selectionEnabeled;
        this.exportOutside = params?.exportOutside === void 0 ? false : params.exportOutside;
        this.respOutside = params?.respOutside === void 0 ? false : params.respOutside;
        this.multiSort = params?.multiSort === void 0 ? false : params.multiSort;

        this.searchOptions = params?.searchOptions === void 0 ? [] : params.searchOptions;

        this.columns = [];
        if (params?.columns !== void 0)
        {
            params?.columns.forEach((col: any) =>
            {
                const c = new TableColumn(col);
                this.columns.push(c);
            });
        }

        this.rowActions = [];
        if (params?.rowActions !== void 0) {
            params?.rowActions.forEach((action: any) => {
                const ac = new TableRowAction(action);
                this.rowActions.push(ac);
            });
        }

        this.acColumnWidth = params?.acColumnWidth === void 0 ? '98px' : params?.acColumnWidth;
    }
}

type cellFormats = 'image' | 'date' | 'datetime' | 'bool' | 'location' | 'number' | 'decimal' | 'decimal1' | 'percent' | 'combine' | 'serial' | 'patient_name';

export class TableColumn {
    name: string;
    title?: string;
    value?: string;
    format?: cellFormats;

    sortable?: boolean;
    sortableFromView?: boolean;
    sortingOutside?: boolean;
    sortColumn?: string;
    width?: string;
    maxWidth?: string;
    align?: string;
    class?: string;
    action?: string;

    visible?: boolean;
    clickable?: boolean;
    showImage?: boolean;
    makeOvals?: boolean;
    isLoop?: boolean;
    statusButton?: boolean;
    showValue?: boolean;

    item_name: string;
    obj_item:string;
    imageUrl?: string;

    condition?: (item: any) => boolean;

    constructor(params?: any) {
        this.name = params?.name;
        this.title = params?.title || params?.name;
        this.value = params?.value || null;
        this.format = params?.format;

        this.sortable = params.sortable === void 0 ? false : params.sortable;
        this.sortableFromView = params.sortableFromView === void 0 ? false : params.sortableFromView;
        this.sortingOutside = params.sortingOutside === void 0 ? true : params.sortingOutside;
        this.sortColumn = params.sortColumn === void 0 ? null : params.sortColumn;

        this.width = params.width || 'auto';
        this.maxWidth = params.maxWidth || 'auto';
        this.align = params.align || 'left';
        this.class = params.class || null;
        this.action = params.action || null;

        this.visible = params.visible === void 0 ? true : params.visible;
        this.clickable = params.clickable === void 0 ? false : params.clickable;
        this.showImage = params.showImage === void 0 ? false : params.showImage;
        this.makeOvals = params.makeOvals === void 0 ? false : params.makeOvals;
        this.isLoop = params.isLoop === void 0 ? false : params.isLoop;
        this.statusButton = params.statusButton === void 0 ? false : params.statusButton;
        this.showValue = params.showValue === void 0 ? true : params.showValue;

        this.item_name = params?.item_name === void 0 ? 'name' : params.item_name;
        this.obj_item = params?.obj_item === void 0 ? '' : params.obj_item;
        this.condition = params?.condition;

        this.imageUrl = params.imageUrl || 'src/assets/images/default_user.png';
    }
}

export class TableRowAction {
    conditional: boolean;

    icon: string;
    tooltip: string;
    type: string;
    action: string;
    width: string;
    btnColor: string;

    condition?: (row: any, action: string) => boolean;

    constructor(params?: any) {
        this.icon = params.icon;
        this.tooltip = params.tooltip;
        this.type = params.type === void 0 ? 'icon' : params.type;
        this.action = params.action;
        this.btnColor = params.btnColor === void 0 ? 'btn-info' : params.btnColor;
        this.width = params.type === 'icon' ? '28px' : 'auto';

        this.conditional = params.conditional === void 0 ? true : params.conditional;

        this.condition = params?.condition;
    }
}

export class TableAction {
    action: 'reload' | 'loadingTrue' | 'loadingFalse' | 'search' | 'search-report' | 'filter' | 'reset-filters' | 'set-search' | 'clear-selection' | 'reset-pagination' | 'setBtnStatus' | 'reset-search';
    row?: any;

    constructor(params: any) {
        this.action = params?.action || null;
    }
}