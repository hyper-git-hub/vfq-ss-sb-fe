import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Group {
    id: number;
    name: string;
    selected: boolean
}


@Component({
    selector: 'app-dual-list',
    templateUrl: './dual-list.component.html',
    styleUrls: ['./dual-list.component.scss']
})
export class DualListComponent implements OnInit {

    @Input() source: Group[];
    @Input() destination: Group[];
    @Input() default: any[];
    @Input() disabled: boolean;
    @Output() signal: EventEmitter<any>;
    @Output() dropdown: EventEmitter<any>;

    selected: any[];
    selectedDropdown: any[] = [];
    destinationDropdown: any[] = [];
    features: any[] = [];
    camFeatures: any[] = [];
    lastMove: any[];
    lastMove2: any[] = [];
    lastMoveDestination: any[];
    dummyData: any[];
    mainData: any[];
    dropdownId: any[] = [];
    generalForm: FormGroup;

    dropdownDestination: any[];

    @Input() defaultSource: any[];

    sourceSelected: boolean;
    destinationSelected: boolean;

    constructor() {
        this.sourceSelected = false;
        this.destinationSelected = false;
        this.disabled = false;
        this.dummyData = [
            { id: 1, name: 'Group 1', selected: false },
            { id: 2, name: 'Group 2', selected: false },
            { id: 3, name: 'Group 3', selected: false },
            { id: 4, name: 'Group 4', selected: false },
        ]
        this.source = []
        this.destination = [];
        this.default = [];
        this.selected = [];
        this.lastMove = [];
        this.dropdownDestination = [];
        this.defaultSource = [];
        this.signal = new EventEmitter();
        this.dropdown = new EventEmitter();
        this.generalForm = new FormGroup({
            camPosition: new FormControl(null),
            camDestination: new FormControl(null),
        });


    }


    ngOnInit(): void {
        // this.defaultSource = this.source;
        // this.setDefault();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['source']) {
            this.source = changes['source'].currentValue;
            if (!!this.source) {
                this.mainData = this.source
            }
        }
        this.extectData(this.mainData)
    }

    extectData(data: any): void {
        data.forEach(element => {
            if (element.feature_id.includes('cam_')) {
                this.camFeatures.push(element);
            }
            else {
                this.features.push(element);
            }
        });
    }

    setDefault() {
        if (this.default.length > 0) {
            this.destination = this.default;
        }
        if (this.destination.length > 0) {
            this.destination.forEach(element => {
                element.selected = false;
                let idx = this.source.findIndex(ele => {
                    return ele.id === element.id;
                });
                this.source.splice(idx, 1);
            });
        }
        setTimeout(() => {
            this.signal.emit(this.destination);
        }, 100);
    }

    reload() {
        this.signal.emit({ type: 'reload' });
        // if (this.lastMove.length > 0)
        // {
        //     this.lastMove.forEach(element =>
        //     {
        //         let idx = this.destination.findIndex(ele => {
        //             return element.id === ele.id;
        //         });

        //         this.destination.splice(idx, 1);
        //         this.source.push(element);
        //     });
        // }
        // this.lastMove = [];

        // if (this.lastMove2.length > 0)
        // {
        //     this.lastMove2.forEach(element =>
        //     {
        //         let idx = this.source.findIndex(ele => {
        //             return element.id === ele.id;
        //         });

        //         this.source.splice(idx, 1);
        //         this.destination.push(element);
        //     });
        // }
        // this.lastMove2 = [];
    }
    onSelectType(event: any): void {
        let arr: any[] = [];
        let idData: any[] = [];
        let idx: any[] = [];
        let id: number;
        event.forEach((element, index) => {
            // idData = element.feature_id?.replace('cam_', '');
            // element.feature_id =element.feature_id?.replace('cam_', '');
            arr.push(element);
            idData.push(element.feature_id);
            idx.push(index)
        })

        this.onSelectDropDown(arr, idx, idData)
    }

    onSelectDropDown(item: any, idx: any, id: any) {
        let idfeature: any = id
        let arr: any[] = item;
        arr.forEach((element: any) => {
            idfeature.filter(x => x.feature_id === element.feature_id);
            if (idfeature.length > 0) {
                element.selected = true;
                this.selectedDropdown.push(element);
            }
        })
        this.camFeatures.forEach(ele => {
            ele.selected ? this.sourceSelected = true : false;
        });
    }

    onSelectSource(item: any, idx: number, id: number) {
        this.features[idx].selected = !this.features[idx].selected;
        this.features.forEach(ele => {
            ele.selected ? this.sourceSelected = true : false;
        });
        if (this.features[idx].selected) {
            this.selected.push(this.features[idx]);
        }
        else {
            let i = this.selected.findIndex(ele => {
                return ele.id === item.id;
            });
            this.selected.splice(i, 1);
        }
    }

    onSelectDestination(item: any, idx: number, id: number) {
        this.destination[idx].selected = !this.destination[idx].selected;
        this.destinationSelected = this.destination[idx].selected ? true : false;
        if (this.destination[idx].selected) {
            this.selected.push(this.destination[idx]);
        }
        else {
            let i = this.selected.findIndex(ele => {
                return ele.id === item.id;
            });
            this.selected.splice(i, 1);
        }
    }
    onDropdownDestination(event: any): void {
        let arr: any[] = [];
        let idData: any[] = [];
        let idx: any[] = [];
        event.forEach((element, index) => {
            arr.push(element);
            idData.push(element.feature_id);
            idx.push(index)
        })
        this.dropdownDestinationSelect(arr, idx, idData);
    }
    dropdownDestinationSelect(item: any, idx: any, id: any) {
        let idfeature: any = id
        let arr: any[] = item;
        arr.forEach((element: any) => {
            idfeature.filter(x => x.feature_id === element.feature_id);
            if (idfeature.length > 0) {
                element.selected = true;
                this.destinationDropdown.push(element);
            }
        })
        this.destinationDropdown.forEach(ele => {
            ele.selected ? this.destinationSelected = true : false;
        });

    }
    addSelected() {
        let arr: any[] = [];
        let idx: any[] = []
        if (this.selectedDropdown.length > 0) {
            this.selectedDropdown.forEach((element: any) => {
                arr.push(element)
                this.selectedDropdown = []
                element.selected = false;
                this.sourceSelected = false;
                if (!this.dropdownDestination.includes(element)) {
                    this.dropdownDestination.push(element);
                }
                this.generalForm.controls['camPosition']?.reset();
                let data: any = this.camFeatures.filter((a, i) => {
                    if (element.feature_id === a.feature_id){
                        this.camFeatures.splice(i, 1);
                    }
                })
                this.dropdown.emit(this.dropdownDestination);
            });
        } else {
        }
        this.selected.forEach(element => {
            this.destination.push(element);
            this.lastMove.push(element);
            element.selected = false;
            this.sourceSelected = false;
            let idx = this.features.findIndex(ele => {
                return element.id === ele.id;
            });

            if (idx !== -1) {
                this.features.splice(idx, 1);
            }
        });
        this.selected = [];
        this.signal.emit(this.destination);
    }

    addAll() {
        this.features.forEach(element => {
            if (!this.destination.includes(element)) {
                this.destination.push(element);
            }
            this.lastMove.push(element);
        });
        this.camFeatures.forEach(element => {
            if (!this.dropdownDestination.includes(element)) {
                this.dropdownDestination.push(element);
            }
        });
        this.mainData = [];
        this.features = [];
        this.camFeatures = [];
        this.signal.emit(this.destination);
        this.dropdown.emit(this.dropdownDestination);

    }

    removeSelected() {
        let arr: any[] = [];
        let idx: any[] = []
        if (this.destinationDropdown.length > 0) {
            this.destinationDropdown.forEach(element => {
                arr.push(element)
                this.destinationDropdown = []
                element.selected = false;
                this.destinationSelected = false;
                if (!this.camFeatures.includes(element)) {
                    this.camFeatures.push(element);
                }
                this.generalForm.controls['camDestination']?.reset();
                let data: any = this.dropdownDestination.filter((a, i) => {
                    if (element.feature_id === a.feature_id){
                        this.dropdownDestination.splice(i, 1);
                    }
                })
                // let id: number = arr.findIndex(x => x.feature_id === element.feature_id)
                // idx.push(id)
                // idx.forEach((ele: any) => {
                //     this.destinationDropdown.splice(ele, 1);
                // });
            });
            this.dropdown.emit(this.dropdownDestination);
        } else {

        }
        this.selected.forEach(element => {
            this.source.push(element);
            this.lastMove2.push(element);
            element.selected = false;
            this.destinationSelected = false;
            let idx = this.destination.findIndex(ele => {
                return element.id === ele.id;
            });
            if (idx !== -1) {
                this.destination.splice(idx, 1);
            }
        });
        this.selected = [];
        this.signal.emit(this.destination);
    }

    removeAll() {
        this.destination.forEach(element => {
            this.features.push(element);
            this.lastMove2.push(element);
        });
        this.dropdownDestination.forEach(element => {
            this.camFeatures.push(element);
            this.lastMove2.push(element);
            // this.lastMove.push(element);
        });
        this.destination = [];
        this.dropdownDestination = [];
        this.signal.emit(this.destination);
        this.dropdown.emit(this.dropdownDestination);

    }
    ngOnDestroy() {
        this.camFeatures = [];
        this.features = [];
        this.signal.emit({ type: 'destroy' });
        this.dropdown.emit({ type: 'destroy' });
    }
}

