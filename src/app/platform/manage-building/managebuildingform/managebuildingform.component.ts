import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { TableConfig } from 'src/app/shared/general-table/model';
import { buildingFormTableConfig, openSpaceFormTableConfig } from '../building/config';
import { spaceFormTableConfig } from '../building/config';
import { BuildingService } from 'src/app/core/services/building.service';
import { ports } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';


@Component({
  selector: 'app-managebuildingform',
  templateUrl: './managebuildingform.component.html',
  styleUrls: ['./managebuildingform.component.scss']
})
export class ManagebuildingformComponent implements OnInit {

  formTitle = 'Add New Building';
  floorForm: FormGroup;
  buildingForm: FormGroup;
  spaceForm: FormGroup;

  building: any[] = [];
  type: any[] = [];
  floor: any[] = [];

  filterFloor: any[] = [
    { id: 1, name: "By Floor" },
    { id: 2, name: "By Open Area" },
    { id: 3, name: "By Space" }
  ];

  disableTab = {
    stepOne: false,
    stepTwo: true,
    stepThree: true,
  }
  buildingCreated: boolean;
  loading: boolean;

  loadingTab = {
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  }

  floorValue: any[] = [];
  floorSpaces: any[] = [];

  floorTable: any[] = [];
  floorSpacesTable: any[] = [];

  spaces: any[] = [];
  active = 1;
  lastInsertedBuilding: any;

  consumersbuild: any[];
  consumersbuild1: any[];
  consumersspace: any[];
  consumers: any[];
  actions: Subject<any> = new Subject();

  configbuilding: TableConfig;
  configspace: TableConfig;
  count: number;
  urlPort = ports;

  data: any;

  selectedType: any

  requestFloor: boolean;
  requestSpace: boolean;
  reqFloorDel: boolean;
  validateSpace = false;

  fieldToDisplay = {
    floors: true,
    appartments: true,
    offices: true,
    shops: true,
    hallways: true,
    lifts: true,
    address: true,
    library: false,
    labs: false,
    canteen: false,
    wards: false,
    stands: false,
    gates: false,
    classRooms: false,
    rooms: false,
    other: true
  };

  typeValues = [
    { name: 'Floors', value: '', key: 'floors', },
    { name: 'Appartments', value: '', key: 'appartments', },
    { name: 'Offices', value: '', key: 'offices', },
    { name: 'Shops', value: '', key: 'shops', },
    { name: 'Hallways', value: '', key: 'hallways', },
    { name: 'Lifts', value: '', key: 'lifts', },
    { name: 'Library', value: '', key: 'library', },
    { name: 'Labs', value: '', key: 'labs', },
    { name: 'Canteen', value: '', key: 'canteen', },
    { name: 'Class Rooms', value: '', key: 'classRooms' },
    { name: 'Wards', value: '', key: 'wards', },
    { name: 'Stands', value: '', key: 'stands', },
    { name: 'Gates', value: '', key: 'gates', },
    { name: 'Rooms', value: '', key: 'rooms', },
    { name: 'Other', value: '', key: 'other', },
    // { name: 'Address', value: '', key: 'address', },
  ];

  typeValuesFloor = [
    { name: 'Appartments', value: '', key: 'appartments' },
    { name: 'Offices', value: '', key: 'offices' },
    { name: 'Shops', value: '', key: 'shops' },
    { name: 'Hallways', value: '', key: 'hallways' },
    { name: 'Lifts', value: '', key: 'lifts' },
    { name: 'Library', value: '', key: 'library' },
    { name: 'Labs', value: '', key: 'labs' },
    { name: 'Canteen', value: '', key: 'canteen' },
    { name: 'Class Rooms', value: '', key: 'classRooms' },
    { name: 'Wards', value: '', key: 'wards' },
    { name: 'Stands', value: '', key: 'stands' },
    { name: 'Gates', value: '', key: 'gates' },
    { name: 'Rooms', value: '', key: 'rooms' },
    { name: 'Other', value: '', key: 'other' },
  ];

  typeValuesSpace = [
    { name: 'Rooms', value: '' }
  ];

  byFloorOrArea = [
    { name: 'By Floor', id: 1 },
    { name: 'By Open Area', id: 2 }
  ];

  floorArea = 1;
  attr: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalRef: NgbActiveModal,
    private buildingService: BuildingService,
    private toastr: ToastrService,
    private dialog: NgbModal
  ) {
    this.configbuilding = new TableConfig(buildingFormTableConfig.config);

    //when Add button is click
    this.data = null;

    // this.count = this.consumers.length;
    this.configspace = new TableConfig(spaceFormTableConfig.config);
    // this.count = this.consumers.length;

    this.buildingForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      check_floor: ['', [Validators.required]],
      floor_name: ['', [Validators.required]],
      type: [null, [Validators.required]],
      no_of_floor: [null, [Validators.required]],
      no_of_area: [0],
      address: [null],
      attributes: this.formBuilder.array([])
    });

    this.attributes.push(this.formBuilder.group({
      floors: new FormControl(1, [Validators.required]),
      appartments: new FormControl('0'),
      offices: new FormControl('0'),
      shops: new FormControl('0'),
      hallways: new FormControl('0'),
      lifts: new FormControl('0'),
      library: new FormControl('0'),
      labs: new FormControl('0'),
      canteen: new FormControl('0'),
      classRooms: new FormControl('0'),
      wards: new FormControl('0'),
      stands: new FormControl('0'),
      gates: new FormControl('0'),
      rooms: new FormControl('0'),
      other: new FormControl('0'),
      // address: new FormControl(''),
    }));

    this.floorForm = this.formBuilder.group({
      id: [null],
      floor: [null, [Validators.required]],
      attributes: this.formBuilder.array([]),
      floorName: [''],
      areaFloor: [''],
      tableFilter: [''],
      tableFloor: [null],
      tableSpaces: [null]
    });

    this.floorAttri.push(this.formBuilder.group({
      appartments: new FormControl('0'),
      offices: new FormControl('0'),
      shops: new FormControl('0'),
      hallways: new FormControl('0'),
      lifts: new FormControl('0'),
      library: new FormControl('0'),
      labs: new FormControl('0'),
      canteen: new FormControl('0'),
      classRooms: new FormControl('0'),
      wards: new FormControl('0'),
      stands: new FormControl('0'),
      gates: new FormControl('0'),
      rooms: new FormControl('0'),
      other: new FormControl('0')
    }));

    this.spaceForm = this.formBuilder.group({
      id: [null],
      floor: [null, [Validators.required]],
      space: [null, [Validators.required]],
      attributes: this.formBuilder.array([]),
      spaceparent: [],
      name: [],
      floorTable: [],
      spaceTable: [],
    });

    this.spaceAttri.push(this.formBuilder.group({
      rooms: new FormControl('0'),
    }));

    this.buildingCreated = false;
    this.loading = false;
  }

  ngOnInit(): void {
    this.type = [
      { id: 1, name: 'Commercial Building', fields: { floors: true, appartments: true, offices: true, shops: true, hallways: true, lifts: true, address: true, other: true } },
      { id: 2, name: 'Residental building', fields: { floors: true, appartments: true, address: true, other: true } },
      { id: 3, name: 'Educational Building', fields: { floors: true, labs: true, library: true, offices: true, canteen: true, classRooms: true, address: true, other: true } },
      { id: 4, name: 'Hospital building', fields: { floors: true, wards: true, offices: true, canteen: true, lifts: true, address: true, other: true } },
      { id: 5, name: 'Stadium', fields: { floors: true, stands: true, gates: true, rooms: true, address: true, other: true } },
      { id: 6, name: 'Other' },
    ];

    // On Edit record
    if (this.data) {
      this.formTitle = 'Edit Building';
      this.disableTab = { stepOne: false, stepTwo: false, stepThree: false }
      this.onEditModal();
    } else {
      this.displayTypeFields(1)
      this.buildingForm.get('type').setValue(1);
      this.formTitle = 'Add New Building';
      this.disableTab = { stepOne: false, stepTwo: true, stepThree: true }
    }
  }

  get attributes() {
    return this.buildingForm.controls["attributes"] as FormArray;
  }
  get floorAttri() {
    return this.floorForm.controls["attributes"] as FormArray;
  }
  get spaceAttri() {
    return this.spaceForm.controls["attributes"] as FormArray;
  }


  getSelectedType(ev) {
    this.selectedType = ev;
    if (this.lastInsertedBuilding) {
      this.getBuildingFloorsById(this.selectedType)
    }
    this.displayTypeFields(ev);

  }

  getSelectedFloor(ev) {
    if (this.lastInsertedBuilding) {
      this.getBuildingFloorsSpacesById(ev)
    }
  }

  getSelectedSpaceAttrTable(ev) {
    console.log(ev)
    this.getFloorAttributesSpaces(this.spaceForm.get('floorTable').value, ev)
  }

  getSelectedFloorTable(ev) {
    this.buildingService.getBuildingSpaces(ev, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.floorSpacesTable = resp.data.data;
      if (this.floorSpacesTable && this.floorSpacesTable.length > 0) {
        this.spaceForm.get('spaceTable').setValue(this.floorSpacesTable[0].id)


        this.buildingService.getSpaceAttribute(ev, this.floorSpacesTable[0].id, this.urlPort.smartBuilding).subscribe((resp: any) => {
          if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
            this.consumersspace = resp['data']['data'];
          } else {
            this.consumersspace = [];
          }
        }, (err: any) => {
        });

      } else {
        this.spaceForm.get('spaceTable').setValue(null);
        this.consumersspace = [];
      }
    }, (err: any) => {
    });
  }

  getSelectedFilter(ev) {
    if (ev === 1) {
      this.deleteFromSelectedTable = 1;
      this.editFromSelectedTable = 1;
      this.floorForm.get('tableFloor')?.setValue(null);
      this.configbuilding = new TableConfig(buildingFormTableConfig.config);
      this.getFloorsOfBuildingForDelete(this.lastInsertedBuilding, true);
    } else if (ev === 2) {
      this.deleteFromSelectedTable = 2;
      this.editFromSelectedTable = 2;
      this.floorForm.get('tableFloor')?.setValue(null);
      this.configbuilding = new TableConfig(openSpaceFormTableConfig.config);
      this.getAllOpenAreas(this.lastInsertedBuilding, true)
    } else if (ev === 3) {
      this.deleteFromSelectedTable = 3;
      this.editFromSelectedTable = 3;
      this.floorForm.get('tableFloor')?.setValue(null);
      this.floorForm.get('tableSpaces')?.setValue(null);
      this.configbuilding = new TableConfig(spaceFormTableConfig.config);
      this.getFloorsOfBuildingForDelete(this.lastInsertedBuilding);
      this.getFloorAttributes(this.lastInsertedBuilding, true);
    }
  }

  getSelectedFilterFloor(parent, ev) {
    console.log(parent)
    console.log(ev)
    if ((parent === 1 || parent === 2) && ev) {
      this.consumersbuild = this.floorValue.filter(item => {
        return item.id === ev
      })
    } else if (parent !== 3) {
      if (parent === 1) {
        this.getFloorsOfBuildingForDelete(this.lastInsertedBuilding, true);
      } else if (parent === 2) {
        this.getAllOpenAreas(this.lastInsertedBuilding, true);
      }
    }
    if (parent === 3 && ev) {
      this.getFloorAttributes(ev, true);
    }
  }

  getSelectedFilterSpace(ev) {
    if (ev) {
      console.log("space m aya")
      this.consumersbuild = this.consumersbuild1.filter(item => {
        return item.id === ev
      })
    } else {
      console.log("space m  ele")
      this.getFloorAttributes(this.floorForm.value.tableFloor, true);
    }
  }

  getSelectedSpaceAttr(ev) {
    this.buildingService.getSpaceAttribute(this.spaceForm.get('floor').value, ev, this.urlPort.smartBuilding)
      .subscribe((resp: any) => {
        if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
          this.setSpaceonBuilding(resp['data']['data'][0]);
        } else {
          this.spaceAttri.at(0).get('rooms').setValue(0);
          this.spaceAttri.at(0).get('rooms').enable();
        }
      }, (err: any) => {
      });
  }

  byFloorOrAreaChange(ev) {
    this.floorArea = ev;
  }

  delByFloorOrAreaChange(ev) {
    this.floorForDelete = [];
    this.floorArea = ev;
    if (this.floorArea === 1) {
      this.getFloorsOfBuildingForDelete(this.lastInsertedBuilding)
    }
    if (this.floorArea === 2) {
      this.getAllOpenAreas(this.lastInsertedBuilding)
    }
  }
  floorForDelete: any;
  getAllOpenAreas(id, forTable?) {
    this.buildingService.getBuildingOpenAreas(id).subscribe(resp => {
      if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
        this.floorForDelete = resp['data']['data'];
        this.setSpaceonBuilding(resp['data']['data']);
        if (forTable) {
          this.floorValue = resp['data']['data'];
          this.consumersbuild = resp['data']['data'];
          this.consumersbuild1 = resp['data']['data'];
        }
      } else {
        this.floorForDelete = [];
        this.consumersbuild = [];
        this.consumersbuild1 = [];
        this.floorValue = [];
        this.spaceForm.reset();
        this.spaceForm.get('floor').setValue(id);
      }
    })
  }

  selectedTypeDelete: any;
  getSelectedTypeDelete(ev) {
    this.selectedTypeDelete = ev;
  }

  deleteFloorName() {
    if (this.selectedTypeDelete) {
      this.deleteBuildingFloorsById(this.selectedTypeDelete)
    } else {
      this.toastr.error('Floor is required');
    }
  }

  deleteBuildingFloorsById(selectedFloor) {
    if (this.floorArea === 1) {
      this.buildingService.deleteFloorById(selectedFloor, this.urlPort.smartBuilding).subscribe((resp: any) => {
        this.selectedTypeDelete = null;
        this.getFloorsOfBuilding(this.lastInsertedBuilding)
        this.toastr.success('Record deleted successfully');
        this.getFloorsOfBuildingForDelete(this.lastInsertedBuilding);
      }, (err: any) => {
        this.toastr.error(err.error.message);
      });
    } else if (this.floorArea === 2) {
      this.buildingService.deleteOpenAreaById(selectedFloor, this.urlPort.smartBuilding).subscribe((resp: any) => {
        this.selectedTypeDelete = null;
        this.getAllOpenAreas(this.lastInsertedBuilding)
        this.toastr.success('Record deleted successfully');
      }, (err: any) => {
        this.toastr.error(err.error.message);
      });
    }
  }

  deleteBuildingSpaces(selectedSpace) {
    this.buildingService.deletingBuildingSpaces(selectedSpace, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.selectedTypeDelete = null;
      this.getFloorsOfBuilding(this.lastInsertedBuilding, true)
      this.toastr.success('Record deleted successfully');
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  deleteBuildingSpacesTable(selectedSpace) {
    this.buildingService.deleteSpaceAttributeTable(selectedSpace.id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.toastr.success('Record deleted successfully');
      this.getFloorAttributesSpaces(selectedSpace.floor, selectedSpace.space)
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  deleteBuildingSpacesTable1(selectedSpace) {
    this.buildingService.deleteSpaceAttributeTable(selectedSpace.id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.toastr.success('Record deleted successfully');
      this.getFloorAttributesSpaces1(selectedSpace.floor, selectedSpace.space)
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  onTableSignals(ev: any) {
    if (ev.type === 'onDeleteFloor') {
      this.onDeleteFloor(ev.row);
    } else if (ev.type === 'onDeleteOpenArea') {
      this.onDeleteOpenArea(ev.row);
    } else if (ev.type === 'onDeleteSpace') {
      this.onDeleteSpace(ev.row);
    } else if (ev.type === 'onDetails') {
      console.log('company cell clicked');
    } else if (ev.type === 'onEditFloor') {
      this.onEditFloor(ev.row);
    } else if (ev.type === 'onEditOpenArea') {
      this.onEditOpenArea(ev.row);
    } else if (ev.type === 'onEditSpace') {
      this.onEditSpace(ev.row);
    }
  }

  onDeleteFloor(row: any) {
    this.onDelete(row, 1)
  }
  onDeleteOpenArea(row: any) {
    this.onDelete(row, 2)
  }
  onDeleteSpace(row: any) {
    this.onDelete(row, 3)
  }

  onEditFloor(row: any) {
    this.onEdit(row, 1)
  }
  onEditOpenArea(row: any) {
    this.onEdit(row, 2)
  }
  onEditSpace(row: any) {
    this.onEdit(row, 3)
  }

  deleteFromSelectedTable = 1;
  deleteSelectedData: any;

  onDelete(ev?: any, deleteTab?) {
    this.deleteSelectedData = ev;
    ev.item = ev.name;
    ev.delete = true;
    ev.edit = false;
    ev.cancel = true;
    this.deleteFromSelectedTable = deleteTab;
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
    }

    dialogRef.closed.subscribe((result) => {
      if (result === 1 && this.deleteFromSelectedTable === 1) {
        this.floorArea = 1;
        this.deleteBuildingFloorsById(this.deleteSelectedData.id);
      }
      if (result === 1 && this.deleteFromSelectedTable === 2) {
        this.floorArea = 2;
        this.deleteBuildingFloorsById(this.deleteSelectedData.id);
      }
      if (result === 1 && this.deleteFromSelectedTable === 3) {
        this.deleteBuildingSpacesTable1(this.deleteSelectedData)
      }
    });

  }

  editFromSelectedTable = 1;
  editSelectedData: any;

  onEdit(ev?: any, editTab?) {
    this.editSelectedData = ev;
    ev.item = ev.name;
    ev.edit = true;
    this.editFromSelectedTable = editTab;
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
    }

    dialogRef.closed.subscribe((result) => {
      if (result && this.editFromSelectedTable === 1) {
        let params = {
          name: result,
          floor_id: this.editSelectedData.id
        }
        this.updateFloor(params, params.floor_id);
      }
      if (result && this.editFromSelectedTable === 2) {
        let params = {
          name: result,
          floor_id: this.editSelectedData.id
        }
        this.updateOpenArea(params, params.floor_id);
      }
      if (result && this.editFromSelectedTable === 3) {
        let params = {
          // attributes: [{
          //   name: result,
          //   value: this.editSelectedData.value
          // }],
          name:result,
          floor: this.editSelectedData.floor,
          spaceparent: this.editSelectedData.spaceparent
        }
        this.updateSpaceAttributeTable(params, this.editSelectedData.id);
      }
    });

  }

  onSubmit(formData: any) {
    this.loading = true;
    this.attr = [];
    // console.log(formData, this.typeValues, this.data);
    
    let payload: any = {
      id: null, name: formData.name, type: formData.type,
      attributes: [], check_floor: null, floor_name: formData.floor_name,
      no_of_area: formData.no_of_area, no_of_floor: null, address: formData.address
    };
    
    

    if (this.data) {
      payload.id = this.data.id;
      payload.attributes = formData.attributes;
      payload.no_of_area = this.data.no_of_area;
      payload.attributes[0].floors = this.data.floor;
      payload.type = this.data.type;
      payload.status = this.data.status;
    }

    if (payload != 6) {
      if (!payload.name || payload.name == "") {
        this.toastr.error("Building name is required");
        this.loading = false;
        return false;
      }

      if (payload.no_of_floor && payload.no_of_floor == '0') {
        this.toastr.error("No of floor is required");
        this.loading = false;
        return false;
      }

      this.attr = this.mapTypeValues(this.typeValues, formData.attributes[0]);
      payload.attributes = this.attr;
      payload.no_of_floor = this.attr[0].value;
  
      this.loadingTab.stepOne = true;
    }

    // if ((!!value.attributes[0].floors && value.attributes[0].floors == '0') && value.type != 6) {
    //   this.toastr.error("No of floor is required");
    //   return false;
    // }

    // if ((!payload.no_of_area || payload.no_of_area === "") && payload.type != 6) {
    //   this.toastr.error("No of Area is required");
    //   return false;
    // }

    console.log(payload);
    if (payload && payload.id) {
      this.updateBuilding(payload, payload.id);
    } else {
      delete payload.id;
      this.createBuilding(payload);
    }
  }

  createBuilding(value: any) {
    this.loading = true;
    this.buildingService.addBuilding(value, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.lastInsertedBuilding = resp.data['id'];
      this.getFloorsOfBuilding(this.lastInsertedBuilding);
      if (value.type != 6) {
        this.goToNextStep(2)
      } else {
        this.loading = false;
        this.onCloseModel();
      }
      setTimeout(() => {
        this.loadingTab.stepOne = false;
        this.disableTab.stepOne = true;
      }, 1000);
      this.buildingCreated = true;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message);
    });
  }

  updateBuilding(value: any, id: any) {
    this.loading = true;
    const type = this.type.filter(item => {
      return item.name == value.type
    })
    if (type && type.length > 0) {
      value.type = type[0]['id'];
    }
    this.buildingService.editbuilding(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.toastr.success("Record updated successfully");
      this.loading = false;
      this.goToNextStep(2);
      setTimeout(() => {
        this.loadingTab.stepOne = false;
      }, 1000);
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message);
    });
  }

  onSubmitFloor(value) {
    this.loadingTab.stepTwo = true;
    if (this.validateSpace) {
      this.goToNextStep(3);
    } else {
      this.loading = true;
      let attributes = this.mapTypeValuesFloor(this.typeValuesFloor, value.attributes[0]);
      let noSpace = attributes.every(ele => {
        return ele.value == 0 || ele.value == '' || ele.value == null || ele.value == undefined;
      })
      if (noSpace) {
        this.loading = false;
        this.toastr.error('Please provide atleast one space', 'Space not provided!');
        return;
      }
      value.attributes = attributes;
      // if (value && this.floor && this.floor.length > 0 && value.id) {
      //   // THIS WILL NOT BE USED AT ANY SCENARIO: USER CANNOT UPDATE FROM FORM.
      //   this.updateFloor(value, value?.floor);
      // } else {
      delete value.id;
      this.createFloor(value);
      // }
    }
  }

  onSubmitSpace(value) {
    this.loadingTab.stepThree = true;
    if (!value.attributes) {
      this.onCloseModel();
      return;
    }
    this.loading = true;
    let attributes = this.mapTypeValuesSpace(this.typeValuesSpace, value.attributes[0]);
    if (attributes[0].value == '0') {
      this.toastr.error('Please provide space attributes.');
      this.loading = false;
      return;
    }
    value.attributes = attributes;
    if (value && value.id) {
      this.updateSpace(value, value.id);
    } else {
      delete value.id;
      if (this.spaceAttri.at(0).get('rooms').value) {
        this.createSpace(value);
      } else {
        this.loading = false;
        this.onCloseModel();
      }
    }
  }

  createFloor(value) {
    if (!value.floor) {
      this.toastr.error("Floor is required");
      return;
    }
    this.loading = true;
    this.buildingService.addFloor(value, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.goToNextStep(3)
      this.getFloorAttributes(value.floor)
      setTimeout(() => {
        this.loadingTab.stepTwo = false;
        this.disableTab.stepTwo = true;
      }, 1000);
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  createSpace(value) {
    this.loading = true;
    this.buildingService.addSpace(value, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.toastr.success('Building has been created');
      this.loading = false;
      this.onCloseModel();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  getFloorsOfBuildingForDelete(id, forTable?) {
    this.buildingService.getBuildingFloors(id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.floorForDelete = resp.data['data'];
      this.floorValue = resp.data['data'];
      if (forTable) {
        this.consumersbuild = resp.data['data'];
        this.consumersbuild1 = resp.data['data'];
      }
    })
  }
  getFloorsOfBuilding(id, forTable?) {
    this.buildingCreated = true;
    this.buildingService.getBuildingFloors(id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.floor = resp.data['data'];
      this.floorTable = resp.data['data'];

      // this.spaceForm.get('floorTable').setValue(this.floorTable[0]?.id)

      this.floorForDelete = resp.data['data'];
      this.consumersbuild = this.floor;
      this.floorValue = resp.data['data'];
      if (!forTable) {
      }
      if (this.floor && this.floor.length > 0) {
        this.floorForm.get('floor').setValue(this.floor[0].id)
        this.spaceForm.get('floor').setValue(this.floor[0].id)
        this.floorForm.get('tableFilter').setValue(1)
        if (this.deleteFromSelectedTable === 2) {
          this.floorForm.get('tableFilter').setValue(2)
          this.getAllOpenAreas(this.lastInsertedBuilding, forTable)
        } else if (this.deleteFromSelectedTable === 3) {
          this.floorForm.get('tableFilter').setValue(3)
        }
        if (this.deleteFromSelectedTable === 1 || this.deleteFromSelectedTable === 3) {
          this.getFloorAttributes(this.floor[0].id, forTable)
        }

        if (!forTable) {
          this.getFloorSpaces(this.floor[0].id)
        }
      }

      if (this.floor && this.floor.length > 0 && !forTable) {
        this.getBuildingFloorsById(this.floor[0].id);
      }
    }, (err: any) => {
    });
  }

  getFloorSpaces(id) {
    this.buildingService.getSpace(id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
        setTimeout(() => {
          this.setSpaceonBuilding(resp['data']['data'][0]);
        }, 1000);
      }
    }, (err: any) => {
    });
  }

  updateFloor(value, id) {
    this.buildingService.editFloor(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.loadingTab.stepTwo = false;
      this.toastr.success("Record updated successfully");
      this.getFloorsOfBuilding(this.lastInsertedBuilding);
    }, (err: any) => {
    });
  }

  updateOpenArea(value, id) {
    this.buildingService.editOpenArea(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.loadingTab.stepTwo = false;
      this.toastr.success("Record updated successfully");
      this.getFloorsOfBuilding(this.lastInsertedBuilding, true);
    }, (err: any) => {
    });
  }

  updateSpaceAttribute(value, id) {
    this.buildingService.editSpaceAttribute(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.loadingTab.stepTwo = false;
      this.toastr.success("Record updated successfully");
      this.getFloorsOfBuilding(this.lastInsertedBuilding, true);
    }, (err: any) => {
    });
  }

  updateSpaceAttributeTable(value, id) {
    this.buildingService.editSpaceAttribute(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.loadingTab.stepTwo = false;
      this.toastr.success("Record updated successfully");
      this.getFloorAttributes(value.floor, true)
    }, (err: any) => {
    });
  }

  updateSpace(value, id) {
    this.loading = true;
    this.buildingService.editSpace(value, id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['messahe']);
    });
  }


  onCloseModel() {
    this.modalRef.close();
  }

  onCheckrequest(event) {
    if (event.target.checked === true) {
      this.requestFloor = true;
      this.floorForm.get('areaFloor').setValue(1);
    }
    else {
      this.requestFloor = false;
    }
  }

  onCheckSpace(event) {
    if (event.target.checked === true) {
      this.requestSpace = true;
      if (this.spaces && this.spaces.length > 0) {
        this.spaceForm.get('spaceparent').setValue(this.spaces[0].id);
      }
    }
    else {
      this.requestSpace = false;
    }
  }

  onCheckrequest1(event) {
    if (event.target.checked === true) {
      this.reqFloorDel = true;
      this.floorForm.get('areaFloor').setValue(1);
    }
    else {
      this.reqFloorDel = false;
    }
  }

  mapTypeValues(typeValues, data) {
    typeValues[0].value = data.floors
    typeValues[1].value = data.appartments
    typeValues[2].value = data.offices
    typeValues[3].value = data.shops
    typeValues[4].value = data.hallways
    typeValues[5].value = data.lifts
    typeValues[6].value = data.library
    typeValues[7].value = data.labs
    typeValues[8].value = data.canteen
    typeValues[9].value = data.classRooms
    typeValues[10].value = data.wards
    typeValues[11].value = data.stands
    typeValues[12].value = data.gates
    typeValues[13].value = data.rooms
    typeValues[14].value = data.other
    // typeValues[15].value = data.address
    return typeValues
  }

  mapTypeValuesFloor(typeValuesFloor, data) {
    typeValuesFloor[0].value = data.appartments
    typeValuesFloor[1].value = data.offices ? data.offices : ''
    typeValuesFloor[2].value = data.shops ? data.shops : ''
    typeValuesFloor[3].value = data.hallways ? data.hallways : ''
    typeValuesFloor[4].value = data.lifts ? data.lifts : ''
    typeValuesFloor[5].value = data.library ? data.library : ''
    typeValuesFloor[6].value = data.labs ? data.labs : ''
    typeValuesFloor[7].value = data.canteen ? data.canteen : ''
    typeValuesFloor[8].value = data.classRooms ? data.classRooms : ''
    typeValuesFloor[9].value = data.wards ? data.wards : ''
    typeValuesFloor[10].value = data.stands ? data.stands : ''
    typeValuesFloor[11].value = data.gates ? data.gates : ''
    typeValuesFloor[12].value = data.rooms ? data.rooms : ''
    typeValuesFloor[13].value = data.other ? data.other : ''
    return typeValuesFloor
  }

  mapTypeValuesSpace(typeValuesSpace, data) {
    typeValuesSpace[0].value = data.rooms
    return typeValuesSpace
  }

  displayTypeFields(type) {
    this.type.forEach(element => {
      if (element.id == type) {
        for (const key in this.fieldToDisplay) {
          this.fieldToDisplay[key] = false;
        }

        for (const key in element.fields) {
          for (const key1 in this.fieldToDisplay) {
            if (key === key1) {
              this.fieldToDisplay[key1] = true;
            }
          }
        }
      }
    })
  }

  datafloor:any;
  onEditModal() {
    this.getFloorsOfBuilding(this.data.id);
    this.lastInsertedBuilding = this.data.id;
    this.datafloor = this.data.floor
    this.buildingForm.patchValue(this.data);

    if (this.data && this.data?.attributes && this.data?.attributes.length > 0) {
      this.typeValues.forEach(element => {
        this.attributes.at(0).get(element.key).setValue(this.filterAttributes(this.data?.attributes, element.name.toLowerCase()))
      });
    }

    const type = this.type.filter(item => {
      return item.name == this.data.type
    })
    if (type && type.length > 0) {
      this.displayTypeFields(type[0]['id']);
    }
    this.attributes.at(0).get('floors').disable();
    this.buildingForm.get('type').disable();
    // this.buildingForm.get('no_of_area').disable();
    this.buildingForm.get('address')?.setValue(this.data.address);
    // this.buildingForm.disable();
  }

  filterAttributes(data, value) {
    let attribute;
    attribute = data?.filter(item => {
      return (item.name).toLowerCase() === value
    });
    return attribute.length > 0 ? attribute[0]['value'] : '';
  }

  getBuildingFloorsById(id) {
    this.buildingService.getFloorsById(id, this.urlPort.smartBuilding).subscribe(resp => {
      if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
        this.spaces = resp['data']['data'];
        this.validateSpace = true;
        this.setFloorsonBuilding(resp['data']['data']);
      } else {
        this.validateSpace = false;
        this.floorForm.reset();
        for (const key in this.fieldToDisplay) {
          if (this.fieldToDisplay[key] && key != 'floors' && key != 'address') {
            this.floorAttri.at(0).get(key).setValue(0)
          }
        }
        this.floorForm.get('areaFloor').setValue(1);
        this.floorForm.get('tableFilter').setValue(1);
        this.floorArea = 1;
        this.typeValuesFloor.forEach(element => {
          this.enableOrDisableFields(element.key, false)
        })
        this.floorForm.get('floor').setValue(id);
      }
    })
  }

  getBuildingFloorsSpacesById(id) {
    this.buildingService.getBuildingSpaces(id, this.urlPort.smartBuilding).subscribe(resp => {
      this.spaceForm.reset();
      this.spaceForm.get('floor').setValue(id);
      this.spaceAttri.at(0).get('rooms').enable();
      this.getFloorAttributes(id);
      // if (resp['data'] && resp['data']['data'] && resp['data']['data'].length > 0) {
      //   // this.setSpaceonBuilding(resp['data']['data'][0]);
      // } else {
      // }
    })
  }


  setFloorsonBuilding(floorData) {
    this.floorForm.patchValue(floorData);
    if (floorData && floorData?.length > 0) {
      this.typeValuesFloor.forEach(element => {
        let field = element.name.toLowerCase();
        this.floorAttri.at(0).get(element.key).setValue(this.filterAttributes(floorData, field))
        if (this.validateSpace) {
          this.enableOrDisableFields(element.key, true)
        } else {
          this.enableOrDisableFields(element.key, false)
        }
      })
    }
  }


  enableOrDisableFields(field, value) {
    if (value) {
      this.floorAttri.at(0).get(field).disable();
    } else {
      this.floorAttri.at(0).get(field).enable();
    }
  }


  setSpaceonBuilding(spaceData) {
    // this.spaceForm.patchValue(spaceData);
    this.spaceForm.get('space').setValue(spaceData.space);
    this.spaceAttri.at(0).get('rooms').setValue(spaceData.value)

    this.spaceForm.get('spaceTable').setValue(spaceData.space);
    // this.getFloorAttributesSpaces(this.floor[0].id, spaceData.space);

    if (this.spaceAttri.at(0).get('rooms').value) {
      this.spaceAttri.at(0).get('rooms').disable();
    } else {
      this.spaceAttri.at(0).get('rooms').enable();
    }
  }

  addSpaceName() {
    let params = {
      name: this.spaceForm.value['name'],
      floor: this.spaceForm.value['floor'],
      spaceparent: this.spaceForm.value['spaceparent']
    }
    if (!params.name || params.name === '') {
      this.toastr.error("Space Name is required");
      return false;
    }

    if (!params.spaceparent || params.spaceparent === '') {
      this.toastr.error("Space is required");
      return false;
    }

    this.buildingService.createSpaceName(params, this.urlPort.smartBuilding).subscribe(resp => {
      this.getFloorsOfBuilding(this.lastInsertedBuilding);
    }, err => {
      this.toastr.error(err.error.message)
    })

  }


  addFloorName() {
    let params = {
      name: this.floorForm.value['floorName'],
      building_id: this.lastInsertedBuilding ? this.lastInsertedBuilding : this.data.id
    }

    let paramsopen = {
      name: this.floorForm.value['floorName'],
      building: this.lastInsertedBuilding ? this.lastInsertedBuilding : this.data.id
    }

    if (!params.name || params.name === '') {
      this.toastr.error("Name is required");
      return;
    }

    if (this.floorArea === 1) {
      this.buildingService.createFloorName(params, this.urlPort.smartBuilding).subscribe(resp => {
        this.getFloorsOfBuilding(this.lastInsertedBuilding, true);
        this.floorForm.get('floorName').setValue('');
        this.toastr.success('Record added successfully');
      }, err => {
        this.toastr.error(err.error.message)
      })
    }
    if (this.floorArea === 2) {
      this.buildingService.createOpenArea(paramsopen, this.urlPort.smartBuilding).subscribe(resp => {
        this.getFloorsOfBuilding(this.lastInsertedBuilding);
        this.floorForm.get('floorName').setValue('');
        this.toastr.success('Record added successfully');
      }, err => {
        this.toastr.error(err.error.message)
      })
    }
  }


  getFloorAttributes(id, forTable?) {
    this.loading = true;
    console.log("fort:",forTable)
    this.buildingService.getBuildingSpaces(id, this.urlPort.smartBuilding).subscribe((resp: any) => {
      this.floorSpaces = resp.data.data;

      if (this.floorSpaces && this.floorSpaces.length > 0) {
        // this.consumersbuild = resp['data']['data'];
        this.floorSpacesTable = resp.data.data;
        
        // this.spaceForm.get('space').setValue(this.floorSpaces[0].id);
        // this.spaceForm.get('spaceTable').setValue(this.floorSpaces[0].id);
      }
      if (forTable) {
        this.consumersbuild = resp['data']['data'];
        this.consumersbuild1 = resp['data']['data'];
      }
      // if (!forTable) {
      //   this.consumersbuild = resp['data']['data'];
      //   this.consumersbuild1 = resp['data']['data'];
      // }
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
    });
  }


  getFloorAttributesSpaces(id, space?) {
    this.buildingService.getSpaceAttribute(id, space, this.urlPort.smartBuilding)
      .subscribe((resp: any) => {
        this.consumersspace = resp.data.data;
      }, (err: any) => {
      });
  }

  getFloorAttributesSpaces1(id, space?) {
    this.buildingService.getSpaceAttribute1(id, space, this.urlPort.smartBuilding)
      .subscribe((resp: any) => {
        this.consumersbuild = resp.data.data;
      }, (err: any) => {
      });
  }



  goToPrevStep(step) {
    if (step === 1) {
      this.disableTab.stepOne = false;
      this.active = 1;
    } else if (step === 2) {
      this.disableTab.stepTwo = false;
      this.active = 2;
    }
  }

  goToNextStep(step) {
    if (step === 2 && (this.loadingTab.stepOne || this.data)) {
      this.disableTab.stepTwo = false;
      this.active = 2;
    } else if (step === 3 && (this.loadingTab.stepTwo || this.data)) {
      this.disableTab.stepThree = false;
      this.active = 3;
    }
  }

}
