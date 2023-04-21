import { environment } from 'src/environments/environment';

export class playbackFormConfig {
  public static config = {
    title: '',
    layout: 'row wrap',
    showTimeInterval: false,

    columns: [
      {
        name: 'buildings', title: '', type: 'dropdown', placeholder: 'Select building', clearable: true,
        options: [{ id: 1, name: 'Building 1' }, { id: 2, name: 'Building 2' }]
      },
      {
        name: 'area', title: '', type: 'dropdown', placeholder: 'Select area',
        options: [{ id: 1, name: 'By Floor' }, { id: 2, name: 'By Open Area' }],
      },
      {
        name: 'floor', title: '', type: 'dropdown', placeholder: 'Select floor',
        options: [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }],
      },
      {
        name: 'space', title: '', type: 'dropdown', placeholder: 'Select space',
        options: [{ id: 1, name: 'Space 1' }, { id: 2, name: 'Space 2' }],
      },
      {
        name: 'camera', title: '', type: 'dropdown', placeholder: 'Select camera', options: [],
      },
    ],
  };
}

export class playbackTimeFormConfig {
  public static config = {
    title: '',
    layout: 'row wrap',
    flexGap: '12px',
    showtime: true,
    showTimeInterval: false,

    columns: [
      {
        name: 'time_interval', title: 'Radio Buttons', type: 'radio', flex: '100%',
        options: [ { id: 1, value: 'today', label: 'Current Day' }, { id: 2, value: 'week', label: 'Previous Week' },
          { id: 3, value: 'month', label: 'Previous Month' }, { id: 4, value: 'period', label: 'Select a Period' } ],
      },
      { name: 'start', title: '', type: 'date', enableDatePicker: false, placeholder: 'Select Start Date' },
      { name: 'end', title: '', type: 'date', enableDatePicker: false, placeholder: 'Select End Date' },
    ],
  };
}
