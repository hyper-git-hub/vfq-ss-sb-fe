export class CreateBuildingForm {
    public static config = {
        title: '',
        layout: 'row wrap',
        showTimeInterval: false,
        columns: [
            { name: 'name', title: 'Name', type: 'input', placeholder: 'Enter Name' },
            {
                name: 'type', title: 'Type', type: 'dropdown', placeholder: 'Select Type',
                options: [{ id: 1, name: 'Commercial Building' }, { id: 2, name: 'Resdential Building' }, { id: 3, name: 'Educational Building' }, { id: 4, name: 'Hospital Building' }, { id: 5, name: 'Stadium' }, { id: 6, name: 'Others' }], default: 'Select Building'
            },
            {
                name: 'no_of_floor', title: 'No of Floors', type: 'number', placeholder: '...',
                options: [{ id: 1, name: 'Building 1' }, { id: 2, name: 'Building 2' }], default: 'Select Building'
            },
        ],
        actions: []
    }
}


